require('dotenv').config();
const express = require('express');
const { hadoopSteps } = require('./steps');
const fetch = global.fetch || require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
  console.error('Error: OPENROUTER_API_KEY not set in .env');
  process.exit(1);
}

app.use(express.static('public'));

console.log("🔑 API KEY (truncated):", API_KEY.slice(0, 10));

// Add route to handle direct step file requests
app.get('/step:num.js', (req, res) => {
    const stepNum = parseInt(req.params.num, 10);
    const filePath = path.join(__dirname, 'public', `step${stepNum}.js`);
    
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Step not found');
        }
    });
});


app.get('/ask', async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    res.status(400).setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.send('Error: Missing "prompt" query parameter');
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://www.hadoop.vercel.app",
        "X-Title": "CodeHelper"
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that writes brief, correct code and Linux commands."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    console.log("🔍 OpenRouter response:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices.length) {
      res.status(500).setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.send('Error: No choices returned from OpenRouter');
    }

    const reply = data.choices[0].message.content || "Empty reply";

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(reply);

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(`Error: ${err.message}`);
  }
});

app.get('/hadoop', (req, res) => {
  const step = parseInt(req.query.install, 10);

  if (!step || step < 1 || step > hadoopSteps.length) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.send(`Invalid step. Please use ?install=1 to ${hadoopSteps.length}`);
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(hadoopSteps[step - 1]);
});


app.listen(PORT, () => {
  console.log(`✅ Server is running at port ${PORT}`);
});
