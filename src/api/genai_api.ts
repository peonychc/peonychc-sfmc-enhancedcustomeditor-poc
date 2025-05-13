import request from '@/api/request';

export function generateEditor(data: any) {

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
  payload.messages[0].content.push({ "type": "text", "text": "generate 3 results" })

  return request({
    url: 'chat/completions',
    method: 'post',
    data: payload
  })
}