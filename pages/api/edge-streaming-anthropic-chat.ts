// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Humanloop } from "humanloop";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request): Promise<Response> {
  const humanloop = new Humanloop({
    apiKey: process.env.HUMANLOOP_PROD_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  });
  const response = await humanloop.chatStream({
    project: "temp-konfig",
    messages: [{ role: "user", content: "Which company built you?" }],
    inputs: {},
    model_config: {
      model: "claude-v1",
      temperature: 0.7,
      provider: "anthropic",
    },
  });
  return new Response(response.data);
}
