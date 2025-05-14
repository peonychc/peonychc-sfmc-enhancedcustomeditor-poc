import request from '@/api/request';

export function generateEditor(data: any) {
  const language = data.language || 'English'; // Default to English if language is not provided
  delete data.language; // Remove language from the data before adding other fields to prompt

  let payload = {
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
        "content": []
      },
    ]
  }
  for (let key in data) {
    payload.messages[0].content.push({ "type": "text", "text": `${key}:${data[key]}` })
  }
  // Add instruction to generate in the specified language
  payload.messages[0].content.push({ "type": "text", "text": `Generate 3 results in ${language}.` })

  return request({
    url: 'chat/completions',
    method: 'post',
    data: payload
  })
}