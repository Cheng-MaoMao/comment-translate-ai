import { OpenAIOptions, requestOpenAI } from './api/openaiClient';
import { GeminiOptions, requestGemini } from './api/geminiClient';

// 定义通用的翻译选项
export type TranslateServiceOptions = (OpenAIOptions | GeminiOptions) & {
    modelType: 'OpenAI' | 'Gemini';
};

// 翻译服务的核心函数
export async function performTranslation(prompt: string, options: TranslateServiceOptions): Promise<string> {
    if (options.modelType === 'OpenAI') {
        const openAIOptions: OpenAIOptions = {
            apiKey: options.apiKey,
            apiEndpoint: (options as any).apiEndpoint,
            model: options.model,
            temperature: (options as any).temperature,
            maxTokens: (options as any).maxTokens,
            streaming: (options as any).streaming,
        };
        return requestOpenAI(prompt, openAIOptions);
    } else if (options.modelType === 'Gemini') {
        const geminiOptions: GeminiOptions = {
            apiKey: options.apiKey,
            model: options.model,
        };
        return requestGemini(prompt, geminiOptions);
    } else {
        throw new Error(`不支持的模型类型: ${options.modelType}`);
    }
}
