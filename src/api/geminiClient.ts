import { GoogleGenerativeAI } from "@google/generative-ai";

// 定义 Gemini 选项的结构
export interface GeminiOptions {
    apiKey: string;
    model: string;
}

// 向 Gemini API 发出请求的函数
export async function requestGemini(prompt: string, options: GeminiOptions): Promise<string> {
    if (!options.apiKey) {
        throw new Error('请配置 API Key');
    }

    const genAI = new GoogleGenerativeAI(options.apiKey);
    const model = genAI.getGenerativeModel({
        model: options.model || "gemini-1.5-flash"
    });

    const result = await model.generateContent({
        contents: [{
            role: "user",
            parts: [{ text: prompt }]
        }]
    });

    const response = await result.response;
    const responseText = response.text();

    if (!responseText) {
        throw new Error('Gemini API 返回内容为空');
    }
    return responseText.trim();
}
