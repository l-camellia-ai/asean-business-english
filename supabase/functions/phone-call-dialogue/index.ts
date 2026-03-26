import { corsHeaders } from '../_shared/cors.ts';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

interface PhoneCallRequest {
  audioBase64?: string;
  audioLength?: number;
  userText?: string;
  conversationHistory: Message[];
  scenarioTitle: string;
  voiceId?: string;
}

Deno.serve(async (req) => {
  // 处理CORS预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('=== 收到新的电话对话请求 ===');
  const requestId = crypto.randomUUID().substring(0, 8);
  console.log('请求ID:', requestId);

  try {
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      console.error('[', requestId, '] API密钥未配置');
      throw new Error('API密钥未配置');
    }
    console.log('[', requestId, '] API密钥已加载');

    const { audioBase64, audioLength, userText, conversationHistory, scenarioTitle, voiceId = 'male-qn-qingse' }: PhoneCallRequest = await req.json();
    
    console.log('[', requestId, '] 请求参数:');
    console.log('- 音频模式:', audioBase64 ? '是' : '否');
    console.log('- 文字模式:', userText ? '是' : '否');
    console.log('- 音频长度:', audioLength || 0, 'bytes');
    console.log('- Base64长度:', audioBase64?.length || 0, 'chars');
    console.log('- 对话历史:', conversationHistory?.length || 0, '条');
    console.log('- 场景:', scenarioTitle);

    let recognizedText = userText || '';

    // 如果没有直接传入文本，则进行语音识别
    if (!recognizedText && audioBase64) {
      console.log('[', requestId, '] === 步骤1: 语音识别 ===');
      console.log('音频数据大小:', audioLength, 'bytes');
      console.log('Base64编码长度:', audioBase64.length, 'chars');

      const speechRecognitionUrl = 'https://app-9s74rqz8t1c1-api-Aa2PZnjEw5NL-gateway.appmiaoda.com/server_api';
      
      const recognitionPayload = {
        format: 'wav',
        rate: 16000,
        dev_pid: 1737, // 英文识别模型（1737=英语，1537=中文）
        cuid: crypto.randomUUID(),
        speech: audioBase64,
        len: audioLength,
      };
      
      console.log('语音识别请求参数:');
      console.log('- format:', recognitionPayload.format);
      console.log('- rate:', recognitionPayload.rate);
      console.log('- dev_pid:', recognitionPayload.dev_pid, '(英文识别 - English)');
      console.log('- cuid:', recognitionPayload.cuid);
      console.log('- len:', recognitionPayload.len);
      console.log('完整请求体:', JSON.stringify(recognitionPayload, null, 2));

      console.log('正在调用语音识别API...');
      const recognitionResponse = await fetch(speechRecognitionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(recognitionPayload),
      });

      console.log('语音识别响应状态:', recognitionResponse.status, recognitionResponse.statusText);

      if (!recognitionResponse.ok) {
        const errorText = await recognitionResponse.text();
        console.error('[', requestId, '] 语音识别API错误:');
        console.error('- 状态码:', recognitionResponse.status);
        console.error('- 响应:', errorText);
        throw new Error(`语音识别失败 (${recognitionResponse.status}): ${errorText}`);
      }

      const recognitionData = await recognitionResponse.json();
      console.log('[', requestId, '] 语音识别响应:', JSON.stringify(recognitionData, null, 2));
      
      if (recognitionData.err_no !== 0) {
        console.error('[', requestId, '] 语音识别错误码:', recognitionData.err_no);
        console.error('[', requestId, '] 错误消息:', recognitionData.err_msg);
        throw new Error(`语音识别错误 (${recognitionData.err_no}): ${recognitionData.err_msg}`);
      }

      recognizedText = recognitionData.result?.[0] || '';
      console.log('[', requestId, '] 识别结果:', recognizedText);

      if (!recognizedText || recognizedText.trim() === '') {
        console.error('[', requestId, '] 识别结果为空');
        throw new Error('未能识别到有效语音内容，请确保说话清晰并靠近麦克风');
      }
    }

    // 验证是否有用户输入
    if (!recognizedText || recognizedText.trim() === '') {
      console.error('[', requestId, '] 未获取到用户输入');
      throw new Error('未能获取有效的用户输入');
    }

    console.log('[', requestId, '] 用户输入:', recognizedText);

    // 步骤2: AI对话 - 生成回复
    console.log('[', requestId, '] === 步骤2: AI对话 ===');
    const chatUrl = 'https://app-9s74rqz8t1c1-api-Aa2PqMJnJGwL-gateway.appmiaoda.com/v1/text/chatcompletion_v2';

    const systemPrompt = `你是一位专业的${scenarioTitle}场景中的商务伙伴。请用英语进行商务对话，保持专业、礼貌的态度。对话应该简洁明了，每次回复控制在2-3句话以内。注意商务礼仪和文化差异。`;

    const messages: Message[] = [
      { role: 'system', content: systemPrompt, name: 'System' },
      ...conversationHistory,
      { role: 'user', content: recognizedText, name: '用户' },
    ];
    
    console.log('AI对话消息数:', messages.length);

    console.log('正在调用AI对话API...');
    const chatResponse = await fetch(chatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gateway-Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.5',
        messages: messages,
        temperature: 0.9,
        max_completion_tokens: 500,
      }),
    });

    console.log('AI对话响应状态:', chatResponse.status, chatResponse.statusText);

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text();
      console.error('[', requestId, '] AI对话API错误:');
      console.error('- 状态码:', chatResponse.status);
      console.error('- 响应:', errorText);
      throw new Error(`AI对话失败: ${chatResponse.status} - ${errorText}`);
    }

    const chatData = await chatResponse.json();
    console.log('[', requestId, '] AI对话响应状态码:', chatData.base_resp?.status_code);

    if (chatData.base_resp?.status_code !== 0) {
      console.error('[', requestId, '] AI对话业务错误:', chatData.base_resp?.status_msg);
      throw new Error(`AI对话错误: ${chatData.base_resp?.status_msg || '未知错误'}`);
    }

    const aiReply = chatData.choices?.[0]?.message?.content || '';
    console.log('[', requestId, '] AI回复:', aiReply);

    if (!aiReply) {
      console.error('[', requestId, '] AI未生成回复');
      throw new Error('AI未能生成有效回复');
    }

    // 步骤3: 语音合成 - 将AI回复转换为语音
    console.log('[', requestId, '] === 步骤3: 语音合成 ===');
    const ttsUrl = 'https://app-9s74rqz8t1c1-api-DLEO7Bj0lORa-gateway.appmiaoda.com/v1/t2a_v2';

    console.log('正在调用语音合成API...');
    const ttsResponse = await fetch(ttsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gateway-Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'speech-2.8-hd',
        text: aiReply,
        stream: false,
        voice_setting: {
          voice_id: voiceId,
          speed: 1.0,
          vol: 1.0,
          pitch: 0,
          emotion: 'calm',
        },
        audio_setting: {
          sample_rate: 32000,
          bitrate: 128000,
          format: 'mp3',
          channel: 1,
        },
        output_format: 'hex',
      }),
    });

    console.log('语音合成响应状态:', ttsResponse.status, ttsResponse.statusText);

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('[', requestId, '] 语音合成API错误:');
      console.error('- 状态码:', ttsResponse.status);
      console.error('- 响应:', errorText);
      throw new Error(`语音合成失败: ${ttsResponse.status} - ${errorText}`);
    }

    const ttsData = await ttsResponse.json();
    console.log('[', requestId, '] 语音合成响应状态码:', ttsData.base_resp?.status_code);

    if (ttsData.base_resp?.status_code !== 0) {
      console.error('[', requestId, '] 语音合成业务错误:', ttsData.base_resp?.status_msg);
      throw new Error(`语音合成错误: ${ttsData.base_resp?.status_msg || '未知错误'}`);
    }

    const audioHex = ttsData.data?.audio || '';
    console.log('[', requestId, '] 语音合成完成，音频长度:', audioHex.length, 'chars');

    console.log('[', requestId, '] === 处理成功 ===');

    // 返回结果
    return new Response(
      JSON.stringify({
        success: true,
        userText: recognizedText,
        aiReply: aiReply,
        audioHex: audioHex,
        audioLength: ttsData.extra_info?.audio_length || 0,
        usage: {
          chat: chatData.usage,
          tts: ttsData.extra_info,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('[', requestId, '] === 处理失败 ===');
    console.error('错误类型:', error?.constructor?.name);
    console.error('错误详情:', error);
    
    let errorMessage = '处理请求时发生错误';
    let errorDetails = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5).join('\n')
      };
      console.error('错误消息:', error.message);
      console.error('错误堆栈:', error.stack);
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
        requestId: requestId
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
