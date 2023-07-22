// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Humanloop } from "humanloop";

export default async function handler(req: Request): Promise<Response> {
  const humanloop = new Humanloop({
    apiKey: process.env.HUMANLOOP_API_KEY,
    basePath: "https://neostaging.humanloop.ml/v4",
    openaiApiKey: process.env.OPENAI_API_KEY,
  });
  const response = await humanloop.completeStream({
    project: "konfig-dev-001",
    inputs: {
      text: "Llamas that are well-socialized and trained to halter and lead after weaning and are very friendly and pleasant to be around. They are extremely curious and most will approach people easily. However, llamas that are bottle-fed or over-socialized and over-handled as youth will become extremely difficult to handle when mature, when they will begin to treat humans as they treat each other, which is characterized by bouts of spitting, kicking and neck wrestling.[33]",
    },
    model_config: {
      model: "fdafaf",
      max_tokens: -1,
      temperature: 0.7,
      prompt_template:
        "Summarize this for a second-grade student:\n\nText:\n{{text}}\n\nSummary:\n",
    },
  });
  return new Response(response.data);
}
