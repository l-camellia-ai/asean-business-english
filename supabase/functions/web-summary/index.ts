import { corsHeaders } from '../_shared/cors.ts';

interface WebSummaryRequest {
  url: string;
  query?: string;
}

Deno.serve(async (req) => {
  // 处理CORS预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      throw new Error('API密钥未配置');
    }

    const { url, query = '请帮我提取这篇文章的市场洞察和关键信息' }: WebSummaryRequest = await req.json();

    if (!url) {
      throw new Error('缺少URL参数');
    }

    console.log('开始分析网页:', url);

    // 调用网页内容总结API
    const apiUrl = 'https://app-9s74rqz8t1c1-api-DY8MNXjBpKAa-gateway.appmiaoda.com/v2/components/c-wf-e1bc471f-1d33-4df1-ab42-87800e89c1ad';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gateway-Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        parameters: {
          _sys_origin_query: query,
          web_url: [url],
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // 检查响应状态
    if (data.content?.[0]?.event?.error_code_int !== 0) {
      throw new Error(data.content?.[0]?.event?.error_message || 'API返回错误');
    }

    // 提取分析结果
    const analysisResult = data.content?.[0]?.raw_data?.origin_response?.node_content?.[0]?.outputs?.output;

    if (!analysisResult) {
      throw new Error('未能提取到有效的分析结果');
    }

    console.log('网页分析完成');

    return new Response(
      JSON.stringify({
        success: true,
        content: analysisResult,
        url: url,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('网页分析错误:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || '处理请求时发生错误',
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
