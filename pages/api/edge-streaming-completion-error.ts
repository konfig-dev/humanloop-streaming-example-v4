// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { AxiosError } from "axios";
import { Humanloop } from "humanloop";

export const config = {
  runtime: "edge",
};

async function readableStreamToString(stream: ReadableStream) {
  // Step 1: Create a new TextDecoder
  const decoder = new TextDecoder();

  // Step 2: Create a new ReadableStreamDefaultReader
  const reader = stream.getReader();

  // Step 3: Initialize an empty string to hold the result
  let result = "";

  try {
    while (true) {
      // Step 4: Read data from the stream
      const { done, value } = await reader.read();

      // If there is no more data to read, break the loop
      if (done) break;

      // Convert the chunk of data to a string using the TextDecoder
      const chunk = decoder.decode(value, { stream: true });

      // Concatenate the chunk to the result
      result += chunk;
    }
  } finally {
    // Step 5: Release the ReadableStreamDefaultReader when done or in case of an error
    reader.releaseLock();
  }

  // Return the final result as a string
  return result;
}

function createMessage(axiosError: AxiosError, responseBody: unknown): string {
  if (
    axiosError.response?.config.url &&
    axiosError.response?.status &&
    axiosError.response?.statusText
  ) {
    const secondLine = `\nResponse Body: ${JSON.stringify(
      responseBody,
      undefined,
      2
    )}`;
    return `Request to ${axiosError.config.url} failed with status code ${axiosError.response.status} (${axiosError.response.statusText})${secondLine}`;
  }
  return axiosError.message;
}

class HumanloopError extends Error {
  private responseBody: unknown;
  constructor(axiosError: AxiosError, responseBody: unknown) {
    super(createMessage(axiosError, responseBody));
    this.responseBody = responseBody;
  }

  toJSON() {
    return {
      message: this.message,
      responseBody: this.responseBody,
    };
  }
}

function parseIfJSON(input: unknown): object | unknown {
  if (typeof input !== "string") {
    // If the input is not a string, return the original input
    return input;
  }

  try {
    // Attempt to parse the input as JSON
    const parsedJSON = JSON.parse(input);

    // Check if the parsed result is an object (not an array or primitive value)
    if (typeof parsedJSON === "object" && parsedJSON !== null) {
      return parsedJSON;
    } else {
      // Return the original input if the parsed result is not an object
      return input;
    }
  } catch (error) {
    // Return the original input if parsing fails (invalid JSON)
    return input;
  }
}

export default async function handler(req: Request): Promise<Response> {
  const humanloop = new Humanloop({
    apiKey: process.env.HUMANLOOP_API_KEY,
    basePath: "https://neostaging.humanloop.ml/v4",
    openaiApiKey: process.env.OPENAI_API_KEY,
  });
  try {
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
  } catch (e) {
    if ((e as any).isAxiosError) {
      const axError: AxiosError = e as AxiosError;
      if (axError.response) {
        const responseBody =
          axError.response.data instanceof ReadableStream
            ? await readableStreamToString(axError.response.data)
            : axError.response.data;
        throw new HumanloopError(axError, parseIfJSON(responseBody));
      }
    }
    throw e;
  }
}
