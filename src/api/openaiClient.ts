import axios from 'axios';
import { window } from 'vscode';

// 定义 OpenAI 选项的结构
export interface OpenAIOptions {
    apiKey: string;
    apiEndpoint: string;
    model: string;
    temperature?: number;
    maxTokens?: number;
    streaming?: boolean;
}

// 向 OpenAI 兼容的 API 发出请求的函数
export async function requestOpenAI(prompt: string, options: OpenAIOptions): Promise<string> {
    if (!options.apiKey) {
        throw new Error('请配置 API Key');
    }

    let url = options.apiEndpoint;
    const endpoint = '/chat/completions';

    if (!url.endsWith(endpoint)) {
        url = `${url.replace(/\/+$/, '')}${endpoint}`;
    }

    // 规范化 URL
    url = url.replace(/^http:\/(?!\/)/, 'http://').replace(/^https:\/(?!\/)/, 'https://');
    const parts = url.split('://');
    if (parts.length === 2) {
        const protocol = parts[0];
        const rest = parts[1].replace(/\/\/+/g, '/');
        url = `${protocol}://${rest}`;
    }

    const data = {
        model: options.model,
        messages: [{
            role: "user",
            content: prompt
        }],
        temperature: options.temperature || 0.5,
        max_tokens: options.maxTokens,
        stream: options.streaming
    };

    const headers = {
        'Authorization': `Bearer ${options.apiKey}`,
        'Content-Type': 'application/json'
    };

    try {
        if (options.streaming) {
            const response = await axios.post(url, data, {
                headers,
                responseType: 'stream',
                timeout: 50000
            });

            let result = '';
            return new Promise<string>((resolve, reject) => {
                response.data.on('data', (chunk: Buffer) => {
                    const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
                    for (const line of lines) {
                        if (line.includes('[DONE]')) continue;
                        try {
                            const jsonStr = line.replace(/^data: /, '').trim();
                            if (jsonStr) {
                                const json = JSON.parse(jsonStr);
                                if (json.choices[0].delta?.content) {
                                    result += json.choices[0].delta.content;
                                }
                            }
                        } catch (e) {
                            console.error('解析流式数据错误:', e);
                        }
                    }
                });
                response.data.on('end', () => resolve(result.trim()));
                response.data.on('error', (err: Error) => reject(err));
            });
        } else {
            const res = await axios.post(url, data, {
                headers,
                timeout: 50000
            });

            if (!res.data?.choices?.[0]?.message?.content) {
                throw new Error('API响应格式不符合标准');
            }
            return res.data.choices[0].message.content.trim();
        }
    } catch (error: any) {
        // 在这里不显示错误消息，让调用者决定如何处理
        // window.showErrorMessage(`请求失败: ${error.message}`);
        throw error;
    }
}
