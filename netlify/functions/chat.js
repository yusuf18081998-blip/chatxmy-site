const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { messages, model } = body;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });
    
    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ answer: data.choices[0].message.content })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No response from AI' })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
