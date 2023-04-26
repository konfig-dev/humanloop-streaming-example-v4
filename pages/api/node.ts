// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatRole, Humanloop } from "humanloop";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const humanloop = new Humanloop({
    apiKey: process.env.HUMANLOOP_API_KEY,
    basePath: "https://neostaging.humanloop.ml/v3",
    openaiApiKey: process.env.OPENAI_API_KEY,
  });
  const response = await humanloop.chat({
    project: "ts-sdk-test",
    messages: [
      {
        role: "system",
        content: "test",
      },
      ...[{ role: ChatRole.System, content: "Write me a song!" }],
    ],
    model_config: {
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
      temperature: 1,
    },
  });
  res.status(200).json(response.data);
}
