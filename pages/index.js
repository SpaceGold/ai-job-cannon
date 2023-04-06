import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import he from "he";
import Markdown from "markdown-it";

export default function Home() {
  const [topicInput, setTopicInput] = useState("");
  const [contextInput, setContextInput] = useState("");
  const [result, setResult] = useState("");
  const [checkboxval, setCheckboxVal] = useState(false);
  const [dataobjectarr, setDataObjectArr] = useState([]);
  const [tempobj, setTempObj] = useState({});
  async function onSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topicInput, context: contextInput}),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      // setDataObject(oldobject => ({...oldobject, response: data.result}))

      setDataObjectArr((oldarr) => [
        ...oldarr,
        { ...tempobj, response: data.result },
      ]);
    } catch (error) {
      console.error(error);
      alert(error.message);
      setDataObjectArr((oldarr) => [
        ...oldarr,
        { ...tempobj, response: error },
      ]);
    }
  }

  // useEffect, breakpoint
  useEffect(() => {
    console.log("tempobj changed:", tempobj);
  }, [tempobj]);

  useEffect(() => {
    console.log("doa changed:", dataobjectarr);
  }, [dataobjectarr]);

  const md = Markdown();
  const html_result = md.render(result);
  const decodedHtml = he.decode(html_result.replace(/&lt;br&gt;/g, "<br>"));

  // simulates an api response
  // const temphtml = "<p>Agex is a biotechnology company focused on developing therapies to address aging-related diseases. Here is a description of Agex in the form of a bulleted list.</p><table><thead><tr><th>Category</th><th>Description</th></tr></thead><tbody><tr><td>Company Name</td><td>Agex Therapeutics, Inc.</td></tr><tr><td>Industry</td><td>Biotechnology</td></tr><tr><td>Focus</td><td>Developing therapies to address aging-related diseases</td></tr><tr><td>Founded</td><td>2017</td></tr><tr><td>Headquarters</td><td>Alameda, California</td></tr><tr><td>CEO</td><td>Dr. Greg Bailey</td></tr><tr><td>Products</td><td>- AgeX Biomedical, Inc. (a subsidiary of Agex) develops regenerative cell therapies for age-related degenerative diseases&lt;br&gt;- PureStem® and UniverCyte™ technologies for the manufacture of cell therapies</td></tr><tr><td>Partnerships</td><td>- Collaboration with Lineage Cell Therapeutics, Inc. to develop cell therapies for age-related macular degeneration&lt;br&gt;- Collaboration with Juvenescence Limited to develop therapies for age-related diseases</td></tr><tr><td>Stock Exchange</td><td>NYSE American</td></tr><tr><td>Ticker Symbol</td><td>AGE</td></tr></tbody></table>"
  // const decodedHtml = he.decode(.replace(/&lt;br&gt;/g, '<br>'));

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
        <text>Enter a context and a topic. For example: <br></br><br></br>Give a description in the form of a bulleted list or table with relevant columns about<br></br><br></br>Neuralink<br></br><br></br></text>
        <input
            type="text"
            name="context"
            placeholder={'Context'}
            value={contextInput}
            onChange={(e) => setContextInput(e.target.value)}
          />
          <input
            type="text"
            name="topic"
            placeholder={'Topic'}
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
          />
          <div className={styles.submitContainer}>
            <button
              type="submit"
              value="Save"
              id="savebutton"
              onClick={() => {
                const newJson = JSON.stringify(dataobjectarr);
                const ourBlob = new Blob([newJson], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(ourBlob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "allresponses.json";
                link.click();
              }}
            >
              Save
            </button>
            &nbsp;&nbsp;&nbsp;  {/* Spacing */}
            <input
              type="submit"
              value="Generate"
              onClick={() => {
                setTempObj({
                  topic: topicInput,
                  context: contextInput,
                  is_work_related: checkboxval,
                });
              }}
            />
            &nbsp;&nbsp;&nbsp;
            <div>
              <input
                  type="checkbox"
                  id="is_work_related"
                  name="is_work_related"
                  value="is_work_related"
                  onChange={(e) => {
                    setCheckboxVal(e.target.checked);
                  }}
                />
              <label htmlFor="is_work_related"> Work Related?
              </label>
            </div>
          </div>
        </form>
        <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />
      </main>
    </div>
  );
}