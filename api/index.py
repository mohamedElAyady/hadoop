from flask import Flask, request, Response
import requests

app = Flask(__name__)

# Put your OpenRouter API key here (for production, use environment variables)
OPENROUTER_API_KEY = "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"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

SYSTEM_PROMPT = "Be brief and smart. You will help by providing commands and code."

@app.route('/ask', methods=['GET'])
def ask():
    prompt = request.args.get('prompt')
    model = request.args.get('model', 'openai/gpt-3.5-turbo')

    if not prompt:
        return Response("Missing prompt in query parameters.", status=400)

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
    }

    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload)
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        return Response(content.strip(), mimetype='text/plain')
    except requests.exceptions.RequestException as e:
        return Response(f"Failed to connect to OpenRouter\nDetails: {str(e)}", status=500)
    except Exception as e:
        return Response(f"Unexpected error\nDetails: {str(e)}", status=500)

# Expose Flask app as handler for Vercel
handler = app