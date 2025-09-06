import * as vscode from 'vscode'; // 导入 VS Code 扩展开发 API
import { languages, Diagnostic, DiagnosticCollection } from 'vscode';
import { AiTranslate } from './AiTranslate';

/**
 * 扩展激活入口
 * 在 VS Code 加载扩展时调用此方法
 * @param context 扩展上下文，用于注册命令和管理资源
 */
const translatedMessageCache = new Map<string, string>();

export function activate(context: vscode.ExtensionContext) {
    // 创建 AI 翻译实例
    const aiTranslate = new AiTranslate();

    // 监听诊断变化
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('ai-translator');
    context.subscriptions.push(diagnosticCollection);

    const translateDiagnostics = async () => {
        const lang = aiTranslate.defaultOption.problemTranslateLang;
        if (!lang || lang === 'none') {
            diagnosticCollection.clear();
            return;
        }

        const allDiagnostics = vscode.languages.getDiagnostics();
        const diagnosticsToUpdate = new Map<string, vscode.Diagnostic[]>();

        for (const [uri, diagnostics] of allDiagnostics) {
            // 过滤掉由本插件创建的诊断信息，避免循环
            const originalDiagnostics = diagnostics.filter(d => d.source !== 'ai-translator');

            if (originalDiagnostics.length === 0) {
                // 如果这个 URI 下没有原始诊断了，就清空我们的翻译诊断
                if (diagnosticCollection.has(uri)) {
                    diagnosticCollection.delete(uri);
                }
                continue;
            }

            const translatedForUri: vscode.Diagnostic[] = [];
            for (const diag of originalDiagnostics) {
                const translatedDiag = await translateSingleDiagnostic(diag, lang, aiTranslate);
                translatedForUri.push(translatedDiag);
            }

            diagnosticsToUpdate.set(uri.toString(), translatedForUri);
        }

        // 清理不再有原始诊断的 URI
        diagnosticCollection.forEach((uri, diags) => {
            if (!diagnosticsToUpdate.has(uri.toString())) {
                diagnosticCollection.delete(uri);
            }
        });

        // 更新需要翻译的诊断
        for (const [uriStr, diags] of diagnosticsToUpdate) {
            diagnosticCollection.set(vscode.Uri.parse(uriStr), diags);
        }
    };

    vscode.languages.onDidChangeDiagnostics(translateDiagnostics);
    // 初始化时也执行一次
    translateDiagnostics();

    // 注册AI命名命令
    let translateVarCommand = vscode.commands.registerCommand('aiTranslate.aiNaming', async () => {
        // 获取当前活动编辑器
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const otherPluginConfig = vscode.workspace.getConfiguration('commentTranslate');//获取插件配置
        const someSetting = otherPluginConfig.get('source');//获取插件配置中的某个配置项

        // 判断翻译源是否为 AI 翻译
        const validSources = [
            'ai-powered-comment-translate-extension', // The extension ID from package.json
            'AI translate' // The display name
        ];

        if (!validSources.includes(someSetting as string)) {
            vscode.window.showInformationMessage('请将翻译源选择为AI translate');
            return;
        }

        // 获取选中的文本和语言类型
        const selection = editor.selection;
        const text = editor.document.getText(selection);
        const languageId = editor.document.languageId;


        try {
            // 调用 AI 翻译服务翻译变量名
            const translatedVar = await aiTranslate.aiNaming(text, languageId);
            // 替换编辑器中选中的文本
            editor.edit(editBuilder => {
                editBuilder.replace(selection, translatedVar);
            });
        } catch (error: any) {
            // 显示错误消息
            vscode.window.showErrorMessage(`变量名翻译失败: ${error.message}`);
        }
    });

    // 将命令添加到扩展上下文的订阅中，以便正确清理
    context.subscriptions.push(translateVarCommand);

    // 返回翻译源注册对象
    return {
        extendTranslate: function (registry: any) {
            // 注册 AI 翻译源
            registry('ai-powered-comment-translate-extension', AiTranslate);
        }
    };
}


// 辅助函数，用于将各种语言标识标准化为 BCP 47 的主要语言代码
function normalizeLang(lang: string): string {
    const langLower = lang.toLowerCase().trim();
    // 映射常见的非标准名称到标准代码
    const langMap: { [key: string]: string } = {
        'chinese': 'zh',
        '中文': 'zh',
        'english': 'en',
        'japanese': 'ja',
        'korean': 'ko',
        'russian': 'ru',
        'german': 'de',
        'spanish': 'es',
        'french': 'fr',
        'italian': 'it'
    };

    if (langMap[langLower]) {
        return langMap[langLower];
    }

    // 处理 "zh-cn", "en-us" 等情况
    if (langLower.includes('-')) {
        return langLower.split('-')[0];
    }

    return langLower;
}


async function translateSingleDiagnostic(diag: vscode.Diagnostic, lang: string, translator: AiTranslate): Promise<vscode.Diagnostic> {
    const cacheKey = `${diag.message}__${lang}`;
    let translatedMsg: string;

    if (translatedMessageCache.has(cacheKey)) {
        translatedMsg = translatedMessageCache.get(cacheKey)!;
    } else {
        try {
            // Directly translate without language check.
            translatedMsg = await translator.translate(diag.message, { to: lang }, true);
            translatedMessageCache.set(cacheKey, translatedMsg);
        } catch {
            translatedMsg = diag.message; // 翻译或检测失败则使用原文
        }
    }

    const newDiag = new vscode.Diagnostic(
        diag.range,
        translatedMsg, // 显示译文或原文
        diag.severity
    );
    newDiag.source = 'ai-translator'; // 设置来源为本插件
    newDiag.code = diag.code;
    return newDiag;
}


/**
 * 扩展停用时的清理函数
 * 在 VS Code 停用扩展时调用此方法
 */
export function deactivate() { }
