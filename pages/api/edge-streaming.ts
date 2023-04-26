// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Humanloop } from "humanloop";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request): Promise<Response> {
  const input = await req.text();
  console.log(input);
  const humanloop = new Humanloop({
    apiKey: process.env.HUMANLOOP_API_KEY,
    basePath: "https://neostaging.humanloop.ml/v4",
    openaiApiKey: process.env.OPENAI_API_KEY,
  });
  const response = await humanloop.chatStream({
    project: "konfig-dev-001",
    messages: [
      {
        role: "system",
        content:
          "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
      },
      { role: "user", content: input },
    ],
    model_config: {
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
      temperature: 1,
    },
  });
  return new Response(response.data);
}
