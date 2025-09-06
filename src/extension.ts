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
    const diagnosticCollection = vscode.languages.createDiagnosticCollection();
    context.subscriptions.push(diagnosticCollection);

    const translateDiagnostics = async () => {
        const lang = aiTranslate.defaultOption.problemTranslateLang;
        if (!lang || lang === 'none') {
            diagnosticCollection.clear();
            return;
        }

        const allDiagnostics = vscode.languages.getDiagnostics();
        for (const [uri, diagnostics] of allDiagnostics) {
            const validDiagnostics = diagnostics.filter(diag => diag.message && diag.message.trim() && !(diag as any).translated);
            if (validDiagnostics.length === 0) {
                // 如果没有需要翻译的，但该uri下还有旧的翻译过的诊断，不清空
                const existing = diagnosticCollection.get(uri);
                if (!existing || existing.length === 0) {
                    diagnosticCollection.delete(uri);
                }
                continue;
            }

            const translatedDiagnostics: vscode.Diagnostic[] = [];
            for (const diag of validDiagnostics) {
                const translatedDiag = await translateSingleDiagnostic(diag, lang, aiTranslate);
                translatedDiagnostics.push(translatedDiag);
            }

            // 合并新的翻译和已有的翻译
            const existingDiagnostics = diagnosticCollection.get(uri)?.filter(d => (d as any).translated) || [];
            diagnosticCollection.set(uri, [...existingDiagnostics, ...translatedDiagnostics]);
        }
    };

    vscode.languages.onDidChangeDiagnostics(translateDiagnostics);

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


async function translateSingleDiagnostic(diag: vscode.Diagnostic, lang: string, translator: AiTranslate): Promise<vscode.Diagnostic> {
    const cacheKey = `${diag.message}__${lang}`;
    let translatedMsg: string;

    if (translatedMessageCache.has(cacheKey)) {
        translatedMsg = translatedMessageCache.get(cacheKey)!;
    } else {
        try {
            translatedMsg = await translator.translate(diag.message, { to: lang }, true);
            translatedMessageCache.set(cacheKey, translatedMsg);
        } catch {
            translatedMsg = diag.message; // 翻译失败则使用原文
        }
    }

    const newDiag = new vscode.Diagnostic(
        diag.range,
        translatedMsg,
        diag.severity
    );
    newDiag.source = diag.source;
    newDiag.code = diag.code;
    (newDiag as any).translated = true; // 标记为已翻译
    return newDiag;
}


/**
 * 扩展停用时的清理函数
 * 在 VS Code 停用扩展时调用此方法
 */
export function deactivate() { }
