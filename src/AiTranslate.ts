import * as vscode from 'vscode';
import { workspace, window } from 'vscode';
import { ITranslate, ITranslateOptions } from 'comment-translate-manager';
import { performTranslation, TranslateServiceOptions } from './translationService';

const PREFIXCONFIG = 'aiTranslate';

// 获取指定配置项的值
export function getConfig<T>(key: string): T | undefined {
    let configuration = workspace.getConfiguration(PREFIXCONFIG); // 获取 AI 翻译的配置对象
    return configuration.get<T>(key); // 返回指定的配置项的值
}

// 定义翻译选项的接口
interface TranslateOption {
    modelType?: 'OpenAI' | 'Gemini';
    largeModelApi?: string; // 仅 OpenAI 模式使用
    largeModelKey: string;
    largeModelName?: string;
    largeModelMaxTokens?: number; // 仅 OpenAI 模式使用
    largeModelTemperature?: number; // 仅 OpenAI 模式使用
    namingRules?: string;
    customTranslatePrompt?: string;
    customNamingPrompt?: string;
    streaming?: boolean; // 仅 OpenAI 模式使用
    filterThinkingContent?: boolean; // 是否过滤深度思考内容
    problemTranslateLang?: string;
}

// AiTranslate 类，实现了 ITranslate 接口
export class AiTranslate implements ITranslate {
    // 翻译引擎的唯一标识符
    readonly id = 'ai-powered-comment-translate-extension';

    // 翻译引擎的名称
    readonly name = 'AI translate';

    // 最大翻译文本长度
    get maxLen(): number {
        return 3000;
    }

    // 实现link方法（来自ITranslate接口）
    link(content: string, { to = 'auto' }: ITranslateOptions): string {
        return content; // 由于使用 API 翻译，无需返回链接，直接返回原文
    }

    private _defaultOption: TranslateOption; // 默认的翻译选项

    public get defaultOption(): TranslateOption {
        return this._defaultOption;
    }

    // 检查自定义提示词的格式
    private checkCustomPrompt(type: 'translate' | 'naming', prompt: string): boolean {
        if (type === 'translate') {
            return prompt.includes('${targetLang}') && prompt.includes('${content}');
        } else {
            return prompt.includes('${variableName}') &&
                prompt.includes('${paragraph}') &&
                prompt.includes('${languageId}');
        }
    }

    // 获取变量所在的完整段落文本
    async getVariableParagraph(document: vscode.TextDocument, lineNumber: number): Promise<string> {
        // 获取当前行的文本
        const currentLine = document.lineAt(lineNumber);
        // 仅返回当前行的文本内容
        return currentLine.text.trim();
    }

    constructor() {
        this._defaultOption = this.createOption(); // 初始化默认选项
        // 监听配置变化事件，更新默认选项
        workspace.onDidChangeConfiguration(async eventNames => {
            if (eventNames.affectsConfiguration(PREFIXCONFIG)) {
                this._defaultOption = this.createOption(); // 更新默认翻译选项
            }
        });
    }

    // 创建翻译选项
    createOption(): TranslateOption {
        const defaultOption: TranslateOption = {
            modelType: getConfig<'OpenAI' | 'Gemini'>('modelType'),
            largeModelApi: getConfig<string>('largeModelApi'),
            largeModelKey: getConfig<string>('largeModelKey'),
            largeModelName: getConfig<string>('largeModelName'),
            largeModelMaxTokens: getConfig<number>('largeModelMaxTokens'),
            largeModelTemperature: getConfig<number>('largeModelTemperature'),
            namingRules: getConfig<string>('namingRules'),
            customTranslatePrompt: getConfig<string>('customTranslatePrompt'),
            customNamingPrompt: getConfig<string>('customNamingPrompt'),
            streaming: getConfig<boolean>('streaming'),
            filterThinkingContent: getConfig<boolean>('filterThinkingContent'),
            problemTranslateLang: getConfig<string>('problemTranslateLang'),
        };
        return defaultOption;
    }

    // 过滤深度思考内容
    private filterThinkingContent(text: string): string {
        if (!this._defaultOption.filterThinkingContent) {
            return text;
        }

        // 保留常用大模型输出的思考内容过滤规则

        // 移除<thinking>...</thinking>标签及其内容
        text = text.replace(/<thinking>[\s\S]*?<\/thinking>/g, '');

        // 移除以"> Reasoning"开头并以"Reasoned for xx seconds"结束的文本块
        text = text.replace(/> Reasoning[\s\S]*?Reasoned for\s*\d+\s*seconds/g, '');

        // 移除多余的空行
        text = text.replace(/\n{3,}/g, '\n\n');

        return text.trim();
    }

    // 使用大模型 API 执行翻译
    async translate(content: string, { to = 'auto' }: ITranslateOptions, suppressErrorMessage: boolean = false) {
        try {
            if (!this._defaultOption.largeModelKey) {
                throw new Error('请配置 API Key');
            }


            const targetLang = to === 'auto' ? 'zh-CN' : to;
            let promptContent: string;

            if (this._defaultOption.customTranslatePrompt) {
                if (!this.checkCustomPrompt('translate', this._defaultOption.customTranslatePrompt)) {
                    throw new Error('翻译提示词格式错误：必须包含 ${targetLang} 和 ${content} 参数');
                }
                promptContent = this._defaultOption.customTranslatePrompt
                    .replace('${targetLang}', targetLang)
                    .replace('${content}', content);
            } else {
                promptContent = `Translate the following text to ${targetLang}. Only return the translated content, without any explanations or extra text.\n\nInput: "${content}"`;
            }

            const options: TranslateServiceOptions = {
                modelType: this._defaultOption.modelType!,
                apiKey: this._defaultOption.largeModelKey,
                apiEndpoint: this._defaultOption.largeModelApi!,
                model: this._defaultOption.largeModelName!,
                temperature: this._defaultOption.largeModelTemperature,
                maxTokens: this._defaultOption.largeModelMaxTokens,
                streaming: this._defaultOption.streaming,
            };

            const result = await performTranslation(promptContent, options);
            return this.filterThinkingContent(result);

        } catch (error: any) {
            if (!suppressErrorMessage) {
                window.showErrorMessage(`翻译失败: ${error.message}`);
            }
            throw error;
        }
    }

    // AI命名方法
    async aiNaming(variableName: string, languageId: string): Promise<string> {
        try {
            if (!this._defaultOption.largeModelKey) {
                throw new Error('请配置 API Key');
            }

            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                throw new Error('未找到活动编辑器');
            }

            const selection = editor.selection;
            const paragraph = await this.getVariableParagraph(editor.document, selection.start.line);

            let promptContent: string;
            if (this._defaultOption.customNamingPrompt) {
                if (!this.checkCustomPrompt('naming', this._defaultOption.customNamingPrompt)) {
                    throw new Error('命名提示词格式错误：必须包含 ${variableName}、${paragraph}、${languageId} 参数');
                }
                promptContent = this._defaultOption.customNamingPrompt
                    .replace(/\${variableName}/g, variableName)
                    .replace('${paragraph}', paragraph)
                    .replace('${languageId}', languageId);
            } else if (this._defaultOption.namingRules == "default") {
                promptContent = `Based on the programming language "${languageId}" and the code context "${paragraph}", determine if "${variableName}" is a class, method, function, or variable. Then, translate "${variableName}" into English following the standard naming conventions for "${languageId}". Return only the translated variable name, with no other text or explanation.`;
            } else {
                promptContent = `Based on the programming language "${languageId}" and the code context "${paragraph}", determine if "${variableName}" is a class, method, function, or variable. Then, translate "${variableName}" into English following the naming convention "${this._defaultOption.namingRules}". Return only the translated variable name, with no other text or explanation.`;
            }

            const options: TranslateServiceOptions = {
                modelType: this._defaultOption.modelType!,
                apiKey: this._defaultOption.largeModelKey,
                apiEndpoint: this._defaultOption.largeModelApi!,
                model: this._defaultOption.largeModelName!,
                temperature: this._defaultOption.largeModelTemperature,
                maxTokens: this._defaultOption.largeModelMaxTokens,
                streaming: this._defaultOption.streaming,
            };

            const result = await performTranslation(promptContent, options);
            return this.filterThinkingContent(result);

        } catch (error: any) {
            window.showErrorMessage(`变量名翻译失败: ${error.message}`);
            throw error;
        }
    }

    // 检测语言方法
    async detectLanguage(text: string): Promise<string> {
        try {
            if (!this._defaultOption.largeModelKey) {
                // 如果没有配置API Key，可以返回一个默认值或抛出错误
                // 在这里我们选择返回 'Configure the large model API key'，让调用者处理
                return 'Configure the large model API key';
            }

            const promptContent = `Your task is to identify the language of the given text. You must respond with ONLY the BCP 47 language code and nothing else. For example, for "你好", respond "zh-CN". For "Hello", respond "en". Do not add any explanation or surrounding text. The text to analyze is: """${text}"""`;

            const options: TranslateServiceOptions = {
                modelType: this._defaultOption.modelType!,
                apiKey: this._defaultOption.largeModelKey,
                apiEndpoint: this._defaultOption.largeModelApi!,
                model: this._defaultOption.largeModelName!,
                temperature: 0, // 对于分类任务，温度设为0更稳定
                maxTokens: 100, // 语言代码很短，不需要很多token
                streaming: false,
            };

            const result = await performTranslation(promptContent, options);

            // 使用正则表达式从返回结果中提取 BCP 47 语言代码
            const bcp47Match = result.match(/[a-zA-Z]{2,3}(-[a-zA-Z0-9]+)*/);
            if (bcp47Match) {
                return bcp47Match[0];
            }

            // 如果正则匹配失败，作为备用方案，返回清理后的原始结果
            return result.trim().replace(/["'.]/g, '');

        } catch (error: any) {
            // 在语言检测失败时，可以不打扰用户，直接在控制台打印错误
            console.error(`Language detection failed: ${error.message}`);
            // 返回 'Language detection failed' 表示检测失败
            return 'Language detection failed';
        }
    }
}
