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
  const topic = req.body.topic || "";
  if (topic.trim().length === 0) {
    // az what is this fitler criteria?
    res.status(400).json({
      error: {
        message: "Please enter a valid topic",
      },
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.01,
      messages: [{ role: "user", content: generatePrompt(topic) }],
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

function generatePrompt(topic) {
  const capitalizedTopic =
    topic[0].toUpperCase() + topic.slice(1).toLowerCase();
  return `very very briefly describe ${capitalizedTopic} doing something super silly`;
}
