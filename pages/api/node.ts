// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Humanloop } from "humanloop";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const humanloop = new Humanloop({
    apiKey: process.env.HUMANLOOP_API_KEY,
    basePath: "http://127.0.0.1:4010",
    openaiApiKey: "OPENAI_TEST_KEY",
  });
  const response = await humanloop.chat({
    project: "ts-sdk-test",
    messages: [
      {
        role: "system",
        content: "test",
      },
      ...[{ role: "system", content: "Write me a song!" }],
    ],
    model_config: {
      model: "text-davinci-003",
      max_tokens: 1000,
      temperature: 1,
    },
  });
  res.status(200).json(response.data);
}
