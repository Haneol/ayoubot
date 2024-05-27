const axios = require("axios");
const fs = require("fs");

const { claudeApiKey } = require("../config.json");
const API_URL = "https://api.anthropic.com/v1/messages";

// systemPrompt.txt 파일 읽기
const systemPrompt = fs.readFileSync("systemPrompt.txt", "utf-8");

async function askClaude(userPrompt) {
  const messages = [
    {
      role: "user",
      content: userPrompt,
    },
  ];

  try {
    const response = await axios.post(
      API_URL,
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 900,
        messages: messages,
        temperature: 0.3,
        system: systemPrompt,
      },
      {
        headers: {
          "content-type": "application/json",
          "anthropic-version": "2023-06-01",
          "x-api-key": claudeApiKey,
        },
      }
    );

    // TODO: 요청이 성공했을 경우, input - output 데이터를 log로 수집한다.

    return response.data.content[0].text;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  askClaude,
};
