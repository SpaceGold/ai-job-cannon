import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import ReactMarkdown from "react-markdown";
import Markdown from "markdown-it";

export default function Home() {
  const [topicInput, setTopicInput] = useState("");
  const [result, setResult] = useState("");

  async function onSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topicInput }),
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


  const md = Markdown();
  const html_result = md.render(result);
  useEffect(() => {}, [html_result]);

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
            name="topic"
            placeholder="Enter a topic (optional)"
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
            />
            <label htmlFor="is_work_related">Work Related?</label>
          </div>
        </form>
        <div className={styles.result}>{html_result}</div>
      </main>
      <p>Agex is a biotech...</p> <table> <thead> <tr> <th>Category</th> <th>Description</th> </tr> </thead> <tbody> <tr> <td>Company Name</td> <td>Agex Therapeutics, Inc.</td> </tr> <tr> <td>Industry</td> <td>Biotechnology</td> </tr> <tr> <td>Focus</td> <td>Developing therapies to address aging-related diseases</td> </tr> <tr> <td>Founded</td> <td>2017</td> </tr> <tr> <td>Headquarters</td> <td>Alameda, California</td> </tr> <tr> <td>CEO</td> <td>Dr. Greg Bailey</td> </tr> <tr> <td>Products</td> <td>- AgeX Biomedical, Inc. (a subsidiary of Agex) develops regenerative cell therapies for age-related degenerative diseases&lt;br&gt;- PureStem® and UniverCyte™ technologies for the manufacture of cell therapies</td> </tr> <tr> <td>Partnerships</td> <td>- Collaboration with Lineage Cell Therapeutics, Inc. to develop cell therapies for age-related macular degeneration&lt;br&gt;- Collaboration with Juvenescence Limited to develop therapies for age-related diseases</td> </tr> <tr> <td>Stock Exchange</td> <td>NYSE American</td> </tr> <tr> <td>Ticker Symbol</td> <td>AGE</td> </tr> </tbody> </table> 
    </div>
    
  );
}
