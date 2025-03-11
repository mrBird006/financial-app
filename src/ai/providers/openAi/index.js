const { TranscriptionProvider, TextStructuringProvider } = require('../index');
const openaiClient = require('../../../clientConnectors/openAI');
const { all } = require('axios');

class OpenAITranscriptionProvider extends TranscriptionProvider {
  async transcribe(file) {
    console.log('file:', file);
    const transcription = await openaiClient.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });
    return transcription.text;
  }
}

class OpenAITextStructuringProvider extends TextStructuringProvider {
  async structurize(prompt, userMessage) {
    const jsonResponse = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": prompt
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": userMessage
            }
          ]
        }
      ],
      response_format: {
        "type": "json_object"
      },
      temperature: 1,
      max_completion_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });
    return JSON.parse(jsonResponse.choices[0].message.content)
  }
}

module.exports = { OpenAITranscriptionProvider, OpenAITextStructuringProvider };