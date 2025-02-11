import Head from "next/head";
import { useRef } from "react";

export default function Home() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <Head>
        <title>Humanloop Test</title>
      </Head>
      <main>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (inputRef.current) {
              const input = inputRef.current.value;

              console.log(input);

              const response = await fetch("/api/edge-streaming", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: input,
              });

              console.log(response);

              if (!response.body) throw Error();

              const decoder = new TextDecoder();
              const reader = response.body.getReader();
              let done = false;
              while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                console.log(decoder.decode(value));
              }
              console.log("finished streaming");
            }
          }}
        >
          <input defaultValue="Hello!" ref={inputRef} />
          <input name="Chat" type="submit" />
        </form>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const response = await fetch(
              "/api/edge-streaming-completion-error",
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            console.log(response);

            if (!response.body) throw Error();

            const decoder = new TextDecoder();
            const reader = response.body.getReader();
            let done = false;
            while (!done) {
              const { value, done: doneReading } = await reader.read();
              done = doneReading;
              console.log(decoder.decode(value));
            }
            console.log("finished streaming");
          }}
        >
          <label>Complete (Error Edge)</label>
          <input name="Complete" type="submit" />
        </form>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const response = await fetch("/api/streaming-completion-error", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            console.log(response);

            if (!response.body) throw Error();

            const decoder = new TextDecoder();
            const reader = response.body.getReader();
            let done = false;
            while (!done) {
              const { value, done: doneReading } = await reader.read();
              done = doneReading;
              console.log(decoder.decode(value));
            }
            console.log("finished streaming");
          }}
        >
          <label>Complete (Error)</label>
          <input name="Complete" type="submit" />
        </form>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const response = await fetch("/api/edge-streaming-completion", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            console.log(response);

            if (!response.body) throw Error();

            const decoder = new TextDecoder();
            const reader = response.body.getReader();
            let done = false;
            while (!done) {
              const { value, done: doneReading } = await reader.read();
              done = doneReading;
              console.log(decoder.decode(value));
            }
            console.log("finished streaming");
          }}
        >
          <label>Complete (Edge)</label>
          <input name="Complete" type="submit" />
        </form>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const response = await fetch("/api/edge-streaming-anthropic-chat", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            console.log(response);

            if (!response.body) throw Error();

            const decoder = new TextDecoder();
            const reader = response.body.getReader();
            let done = false;
            while (!done) {
              const { value, done: doneReading } = await reader.read();
              done = doneReading;
              console.log(decoder.decode(value));
            }
            console.log("finished streaming");
          }}
        >
          <label>Anthropic Chat</label>
          <input name="Anthropic Chat" type="submit" />
        </form>
      </main>
    </>
  );
}
