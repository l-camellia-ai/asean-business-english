/**
 * 数字人语音对话服务 - 后端接口
 * 功能：
 * 1. 调用阿里云百炼智能体应用获取回复
 * 2. 使用复刻音色合成音频（cosyvoice-v3.5-plus）
 * 3. 返回文本和音频流给前端
 * 
 * 接口调用方式：
 * POST /api/chat
 * Body: { "text": "你好", "mode": "chat", "language": "zh" }
 * Response: 
 *   - 成功：{ "success": true, "data": "回复文本", "audio": "音频 URL" }
 *   - 失败：{ "success": false, "error": "错误信息" }
 */

const express = require('express');
const cors = require('cors');
const https = require('https');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================================================
// 配置管理 - 支持环境变量读取，避免硬编码
// ============================================================================
const config = {
  // 百炼应用配置
  appId: process.env.BAILIAN_APP_ID || 'f30eb64732064d94807781ae4e8d938b',
  apiKey: process.env.BAILIAN_API_KEY || 'sk-a4ce50f4b5594c0daddeb9022199102e',

  // 语音合成配置 - 使用复刻音色 ID
  ttsModel: 'cosyvoice-v3.5-plus',
  voiceId: 'cosyvoice-v3.5-plus-bailian-f53be35f4cd54af69be4bd055fdb52af', // 复刻音色"阮氏琼"

  // 服务器配置
  httpPort: parseInt(process.env.HTTP_PORT) || 3000,
  httpsPort: parseInt(process.env.HTTPS_PORT) || 3443
};

console.log('服务配置已加载');
console.log('应用 ID:', config.appId);
console.log('语音模型:', config.ttsModel);
console.log('音色 ID:', config.voiceId);

// ============================================================================
// 静态文件服务
// ============================================================================
app.use(express.static(path.join(__dirname, '../'), { maxAge: '0' }));
app.use(express.static(path.join(__dirname, '../www'), { maxAge: '0' }));

// ============================================================================
// 主接口：智能对话 + 语音合成
// ============================================================================
app.post('/api/chat', async (req, res) => {
  try {
    const { text, mode, language } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        error: '请求参数错误：text 不能为空'
      });
    }

    console.log('\n========== 收到对话请求 ==========');
    console.log('文本:', text);
    console.log('模式:', mode || '默认');
    console.log('语言:', language || '自动');

    // 步骤 1: 调用智能体应用获取文本回复
    console.log('\n[步骤 1] 调用智能体应用...');
    const textResponse = await callAgentApp(text);
    console.log('✓ 智能体回复:', textResponse);

    // 移除表情符号，避免被朗读
    const cleanText = removeEmoji(textResponse);
    console.log('✓ 清理后的回复:', cleanText);

    // 步骤 2: 使用复刻音色合成音频
    console.log('\n[步骤 2] 合成音频...');
    let audioUrl = null;

    try {
      audioUrl = await synthesizeSpeech(cleanText);
      console.log('✓ 音频合成成功，URL:', audioUrl);
    } catch (ttsError) {
      console.log('⚠️ 语音合成失败:', ttsError.message);
      console.log('  文字回复仍可用，前端将使用浏览器默认 TTS');
    }

    // 返回文本和音频 URL
    res.json({
      success: true,
      data: cleanText,
      audio: audioUrl
    });

    console.log('\n========== 请求处理完成 ==========');

  } catch (error) {
    console.error('\n 对话失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// 工具函数：移除表情符号
// ============================================================================
function removeEmoji(text) {
  return text.replace(/[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E0}-\u{1F1FF}]/gu, '');
}

// ============================================================================
// 核心函数：调用百炼智能体应用
// ============================================================================
async function callAgentApp(userText) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'dashscope.aliyuncs.com',
      port: 443,
      path: `/api/v2/apps/agent/${config.appId}/compatible-mode/v1/responses`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      }
    };

    const postData = JSON.stringify({
      input: [{
        role: 'user',
        content: userText
      }]
    });

    console.log('智能体 API 请求路径:', options.path);

    const req = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });

      response.on('end', () => {
        try {
          const result = JSON.parse(data);

          // 输出完整响应，方便调试（仅在前 1000 字符）
          console.log('智能体响应状态码:', response.statusCode);
          console.log('智能体响应预览:', JSON.stringify(result).substring(0, 1000) + '...');

          // 检查 HTTP 状态码
          if (response.statusCode !== 200) {
            console.error('智能体 API 错误:', result);
            reject(new Error(`智能体服务异常：${result.message || result.code || 'HTTP ' + response.statusCode}`));
            return;
          }

          // 解析回复文本（支持多种格式，兼容工具调用场景）
          let replyText = null;

          // ========== 场景 1: 标准 Responses API 格式（无工具调用） ==========
          // 格式：output[0].content[0].text
          if (result.output?.[0]?.content?.[0]?.text) {
            replyText = result.output[0].content[0].text;
            console.log('✓ 使用标准格式：output[0].content[0].text');
          }
          // ========== 场景 2: OpenAI 兼容格式（无工具调用） ==========
          // 格式：choices[0].message.content
          else if (result.choices?.[0]?.message?.content) {
            replyText = result.choices[0].message.content;
            console.log('✓ 使用 OpenAI 兼容格式：choices[0].message.content');
          }
          // ========== 场景 3: 触发工具调用后的完整回复 ==========
          // 当智能体调用工具（如联网搜索）后，最终回复可能在 output 的最后一个 message 中
          else if (result.output && Array.isArray(result.output) && result.output.length > 0) {
            // 从后往前找，找到第一个有 text 内容的 message
            for (let i = result.output.length - 1; i >= 0; i--) {
              const item = result.output[i];

              // 检查 item.content[0].text
              if (item.content?.[0]?.text) {
                replyText = item.content[0].text;
                console.log(`✓ 使用 output[${i}].content[0].text（工具调用后的回复）`);
                break;
              }

              // 检查 item.content（直接是字符串）
              if (typeof item.content === 'string') {
                replyText = item.content;
                console.log(`✓ 使用 output[${i}].content（字符串格式）`);
                break;
              }
            }
          }
          // ========== 场景 4: choices 数组中有多个 message（工具调用场景） ==========
          else if (result.choices && Array.isArray(result.choices) && result.choices.length > 0) {
            // 从后往前找，找到第一个有 content 的 message
            for (let i = result.choices.length - 1; i >= 0; i--) {
              const choice = result.choices[i];

              // 检查 choice.message.content
              if (choice.message?.content) {
                replyText = choice.message.content;
                console.log(`✓ 使用 choices[${i}].message.content（工具调用场景）`);
                break;
              }
            }
          }
          // ========== 场景 5: output.text 简写格式 ==========
          else if (result.output?.text) {
            replyText = result.output.text;
            console.log('✓ 使用 output.text 简写格式');
          }
          // ========== 场景 6: result.text 最简格式 ==========
          else if (result.text) {
            replyText = result.text;
            console.log('✓ 使用 text 最简格式');
          }

          // 检查是否成功提取到文本
          if (replyText) {
            console.log('✓ 成功提取回复文本，长度:', replyText.length);
            resolve(replyText);
          } else {
            // 输出详细的调试信息
            console.error('❌ 智能体返回数据格式错误，未找到 text 字段');
            console.error('可用顶级字段:', Object.keys(result));
            console.error('output 结构:', result.output ? Array.isArray(result.output) ? `数组[${result.output.length}]` : typeof result.output : 'undefined');
            console.error('choices 结构:', result.choices ? Array.isArray(result.choices) ? `数组[${result.choices.length}]` : typeof result.choices : 'undefined');

            // 输出 output 的详细内容（如果有）
            if (result.output && Array.isArray(result.output)) {
              result.output.forEach((item, index) => {
                console.error(`output[${index}] 结构:`, {
                  hasContent: !!item.content,
                  contentType: typeof item.content,
                  contentIsArray: Array.isArray(item.content),
                  hasRole: !!item.role,
                  role: item.role
                });
              });
            }

            reject(new Error('智能体返回数据格式错误'));
          }
        } catch (e) {
          console.error('解析智能体响应失败:', e.message);
          console.error('原始数据:', data);
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      console.error('智能体请求失败:', e.message);
      reject(new Error(`网络错误：${e.message}`));
    });

    req.write(postData);
    req.end();
  });
}

// ============================================================================
// 核心函数：语音合成（使用复刻音色）
// ============================================================================
async function synthesizeSpeech(text) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'dashscope.aliyuncs.com',
      port: 443,
      path: '/api/v1/services/audio/tts/SpeechSynthesizer',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      }
    };

    // 根据阿里云百炼官方文档格式调用
    const postData = JSON.stringify({
      model: config.ttsModel,
      input: {
        text: text,
        voice: config.voiceId  // 使用复刻音色 ID
      }
    });

    console.log('TTS 请求参数:', JSON.stringify({
      model: config.ttsModel,
      voice: config.voiceId,
      textLength: text.length
    }));

    const req = https.request(options, (response) => {
      let data = '';

      console.log('TTS 响应状态码:', response.statusCode);

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const result = JSON.parse(data);

          // 检查错误
          if (response.statusCode !== 200) {
            console.error('TTS API 错误:', result);
            reject(new Error(`语音合成失败：${result.message || result.code || 'HTTP ' + response.statusCode}`));
            return;
          }

          // 解析音频 URL（新版 API 返回 URL 而不是 Base64）
          let audioUrl = null;

          // 格式 1: output.audio.url（新版 API 主要返回格式）
          if (result.output?.audio?.url) {
            audioUrl = result.output.audio.url;
            console.log('✓ 使用 output.audio.url 格式');
            // 将 HTTP 改为 HTTPS，避免浏览器 Mixed Content 错误
            audioUrl = audioUrl.replace('http://', 'https://');
            console.log('  音频 URL:', audioUrl);
          }
          // 格式 2: audio.audio_data（旧版 API，兼容处理）
          else if (result.audio?.audio_data) {
            // 如果是 Base64 数据，转换为临时 URL 格式（兼容旧版）
            console.log('⚠️ 检测到旧版 audio.audio_data 格式，已转换');
            audioUrl = 'data:audio/mp3;base64,' + result.audio.audio_data;
          }
          // 格式 3: output.audio.data（兼容处理）
          else if (result.output?.audio?.data) {
            console.log('⚠️ 检测到 output.audio.data 格式，已转换');
            audioUrl = 'data:audio/mp3;base64,' + result.output.audio.data;
          }

          if (audioUrl) {
            resolve(audioUrl);
          } else {
            console.error('TTS 返回格式错误，缺少 audio.url 字段:', result);
            reject(new Error('语音合成返回格式错误：未找到音频 URL'));
          }
        } catch (e) {
          console.error('解析 TTS 响应失败:', e.message);
          reject(new Error(`解析音频数据失败：${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error('TTS 请求失败:', e.message);
      reject(new Error(`网络错误：${e.message}`));
    });

    req.write(postData);
    req.end();
  });
}

// ============================================================================
// 启动服务器
// ============================================================================
function startServer() {
  // HTTP 服务器
  app.listen(config.httpPort, '0.0.0.0', () => {
    console.log(`\nHTTP 服务器运行在 http://0.0.0.0:${config.httpPort}`);
  });

  // HTTPS 服务器（需要证书）
  try {
    const keyPath = path.join(__dirname, 'ssl', 'server.key');
    const certPath = path.join(__dirname, 'ssl', 'server.crt');

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      const options = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };

      const httpsServer = https.createServer(options, app);
      httpsServer.listen(config.httpsPort, '0.0.0.0', () => {
        console.log(`✅ HTTPS 服务器运行在 https://0.0.0.0:${config.httpsPort}`);
        console.log('\n提示：请使用 HTTPS 地址访问以启用浏览器语音识别功能');
      });
    } else {
      console.log('\n⚠️ 未找到 SSL 证书，仅启用 HTTP');
      console.log('如需 HTTPS，请在 server/ssl 目录放置 server.key 和 server.crt');
    }
  } catch (error) {
    console.error('\n❌ HTTPS 服务器启动失败:', error.message);
  }
}

// 启动服务
startServer();
