const express = require("express");

const cors = require("cors");

const bodyParser = require("body-parser");

const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  // apiKey: process.env.REACT_APP_API_KEY,
  apiKey: "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"
});



const openai = new OpenAIApi(config);

// Setup server

const app = express();
app.use(bodyParser.json());
app.use(cors());

// endpoint for ChatGPT

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 512,
    temperature: 0,
    prompt: prompt,
  });
  console.log(completion.data.choices[0]);
  res.send(completion.data.choices[0].text);
});

const PORT = 8020;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});