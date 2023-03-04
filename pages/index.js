import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
// import * as db from "../pages/api/db_queries";

// const { Client } = require("pg");
// const dotenv = require("dotenv")
// dotenv.config()
//
// const connectDb = async () => {
//     try {
//         const client = new Client({
//             user: process.env.PGUSER,
//             host: process.env.PGHOST,
//             database: process.env.PGDATABASE,
//             port: process.env.PGPORT
//         })
//
//         await client.connect()
//         const res = await client.query('SELECT * FROM some_table')
//         console.log(res)
//         await client.end()
//     } catch (error) {
//         console.log(error)
//     }
// }
//
// connectDb()

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

  useEffect(() => {}, [result]);

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
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
