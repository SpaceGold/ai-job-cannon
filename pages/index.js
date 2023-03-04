import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [preamblePhraseInput, setPreamblePhraseInput] = useState("");
  const [promptInput, setPromptInput] = useState("");
  const [connectorPhraseInput, setConnectorPhraseInput] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [result, setResult] = useState("");
  const [isWorkRelated, setIsWorkRelated] = useState(false);
  // TODO for Adam: watch Tyler McGinnis React videos
  async function onSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // unused?
        body: JSON.stringify({
          task: topicInput,
          task2: preamblePhraseInput,
          context: connectorPhraseInput,
          topic: promptInput,
        }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  useEffect(() => {}, [result]);

  const handleChange = () => {
    setIsWorkRelated(!isWorkRelated);
  };

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/cannon.png" />
      </Head>

      <main className={styles.main}>
        <img src="/cannon.png" className={styles.icon} />
        <h3>Job Cannon</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="preamblePhrase"
            placeholder="preamble e.g. 'Write a'"
            value={preamblePhraseInput}
            onChange={(e) => setPreamblePhraseInput(e.target.value)}
          />
          <input
            type="text"
            name="prompt"
            placeholder="prompt e.g. 'friendly note expressing interest in a job'"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />
          <input
            type="text"
            name="connectorPhrase"
            placeholder="connecting phrase e.g. 'as though you yourself are a'"
            value={connectorPhraseInput}
            onChange={(e) => setConnectorPhraseInput(e.target.value)}
          />
          <input
            type="text"
            name="topic"
            placeholder="topic or role e.g. 'professional drag queen'"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
          />
          <div className={styles.submitContainer}>
            <input type="submit" value="Generate" />
            <input
              type="checkbox"
              id="is_work_related"
              name="is_work_related"
              value="is_work_related"
              onChange={handleChange}
            />
            <label htmlFor="is_work_related">Work Related?</label>
          </div>
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
