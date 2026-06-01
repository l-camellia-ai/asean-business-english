/**
 * 数字人语音对话服务 - API接口
 * 对接 deploy/server 后端服务
 */

const API_BASE_URL = import.meta.env.VITE_DIGITAL_HUMAN_API_URL || 'http://localhost:3000';

export interface ChatRequest {
  text: string;
  mode?: string;
  language?: string;
}

export interface ChatResponse {
  success: boolean;
  data?: string;
  audio?: string;
  error?: string;
}

/**
 * 发送消息到数字人AI
 * @param text 用户输入的文本
 * @param mode 对话模式 (chat/interpret/photo/ielts/kids/teaching/scenario)
 * @param language 语言 (zh/en)
 * @returns AI回复文本和音频URL
 */
export async function sendChatMessage(
  text: string,
  mode: string = 'chat',
  language: string = 'zh'
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        mode,
        language,
      } as ChatRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ChatResponse = await response.json();
    return result;
  } catch (error) {
    console.error('发送消息失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '网络请求失败',
    };
  }
}

/**
 * 播放音频URL
 * @param url 音频URL
 * @returns Promise，音频播放完成时resolve
 */
export function playAudioUrl(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);

    audio.onended = () => {
      resolve();
    };

    audio.onerror = (e) => {
      console.error('音频播放失败:', e);
      reject(new Error('音频播放失败'));
    };

    audio.play().catch(reject);
  });
}

/**
 * 播放Base64音频数据
 * @param base64Data Base64编码的音频数据
 * @returns Promise，音频播放完成时resolve
 */
export function playAudioBase64(base64Data: string): Promise<void> {
  return playAudioUrl(`data:audio/mp3;base64,${base64Data}`);
}

export default {
  sendChatMessage,
  playAudioUrl,
  playAudioBase64,
};
