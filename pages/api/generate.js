import { Configuration, OpenAIApi } from "openai";
import { getWorkPlay } from "./db_queries";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }
  const preamblePhrase = req.body.topic || "";
  const topic = req.body.topic || "";
  const connectorPhrase = req.body.topic || "";
  const prompt = req.body.prompt || "";
  const isWorkRelated = req.body.isWorkRelated;


  console.log("work related? ", isWorkRelated);

  if (topic.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid topic",
      },
    });
    return;
  }

  // buggy:
  // if (prompt.trim().length === 0) {
  //   res.status(400).json({
  //     error: {
  //       message: "Please enter a valid prompt",
  //     },
  //   });
  //   return;
  // }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 1.5,
      messages: [{ role: "user", content: generatePrompt(preamblePhrase, 
        prompt, connectorPhrase, topic) }],
    });

    // json_dump | is_work_related | prompt_vars | prompt | response

    const dbRes = await getWorkPlay(req, res, completion);
    console.log("dbRes, sending real res right after.. ", dbRes);

    res
      .status(200)
      .json({ result: completion.data.choices[0].message.content });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(preamblePhrase, prompt, connectorPhrase, topic) {
  // return `write a ${prompt} as though you yourself are a ${topic}`;
  return `${preamblePhrase} ${prompt} ${connectorPhrase} ${topic}`;
  
}


{/* <TextField
  id="first-name"
  label="Name"
  value={this.state.name}
  onChange={this.handleChange('name')}
  margin="normal"
/> */}