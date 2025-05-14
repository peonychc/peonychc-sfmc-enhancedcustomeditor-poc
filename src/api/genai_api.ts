import request from '@/api/request';

export function generateEditor(data: any) {
  // Language will be handled in a separate translation step.
  // Create a copy of data and remove language if it exists, to avoid sending it for initial generation.
  const generationData = { ...data };
  delete generationData.language;

  let payload = {
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
        "content": []
      },
    ]
  }
  for (let key in generationData) {
    payload.messages[0].content.push({ "type": "text", "text": `${key}:${generationData[key]}` })
  }
  // Generic instruction for initial generation
  payload.messages[0].content.push({ "type": "text", "text": "Generate 3 results." })

  return request({
    url: 'chat/completions',
    method: 'post',
    data: payload
  })
}

export function translateContent(textArray: string[], targetLanguage: string) {
  if (!textArray || textArray.length === 0) {
    return Promise.resolve({ choices: [] }); // Return empty if no text to translate
  }

  // Format the text array into a numbered list for the prompt
  const textToTranslate = textArray.map((text, index) => `${index + 1}. ${text}`).join('\n');

  const payload = {
    "model": "gpt-4o-mini", // Or your preferred model for translation
    "messages": [
      {
        "role": "user",
        "content": [
          { "type": "text", "text": `Translate the following list of texts into ${targetLanguage}. Maintain the numbered list format and provide only the translated texts:\n\n${textToTranslate}` }
        ]
      },
    ]
  };

  return request({
    url: 'chat/completions',
    method: 'post',
    data: payload
  });
}