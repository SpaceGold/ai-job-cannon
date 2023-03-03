import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
  
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          companyName,
          applicantName,
        }),
      });
  
      const data = await response.json();
  
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
  
      setCoverLetter(data.result);
      console.log(data.result); // Logging the generated cover letter to the console
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }
  

  return (
    <div>
      <Head>
        <title>Cover Letter Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Cover Letter Generator</h1>
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="jobTitle">Job Title:</label>
            <input
              type="text"
              name="jobTitle"
              placeholder="Enter job title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="companyName">Company Name:</label>
            <input
              type="text"
              name="companyName"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="applicantName">Your Name:</label>
            <input
              type="text"
              name="applicantName"
              placeholder="Enter your name"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
            />
          </div>
          <button type="submit">Generate Cover Letter</button>
        </form>
        {coverLetter && <p>{coverLetter}</p>}
      </main>
    </div>
  );
}
