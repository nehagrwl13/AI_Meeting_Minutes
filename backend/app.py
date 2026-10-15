
import os
import json
import re
import requests

from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(
    os.path.join(BASE_DIR, "..", "frontend")
)

app = Flask(__name__, static_folder=FRONTEND_DIR)

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")


@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/<path:filename>")
def frontend_files(filename):
    return send_from_directory(FRONTEND_DIR, filename)


@app.route("/api/generate", methods=["POST"])
def generate_minutes():
    data = request.get_json(silent=True) or {}
    notes = data.get("notes", "")

    if not isinstance(notes, str) or not notes.strip():
        return jsonify({
            "error": "Meeting notes are required."
        }), 400

    if len(notes) > 30000:
        return jsonify({
            "error": "Meeting notes are too long."
        }), 400

    if not API_KEY:
        return jsonify({
            "error": "GEMINI_API_KEY is missing in .env"
        }), 500

    prompt = """
You are an expert AI Meeting Minutes Generator.

Convert the following unstructured meeting notes into
professional and concise structured meeting minutes.

Extract:
1. Meeting summary
2. Key decisions
3. Action items
4. Responsible persons and deadlines

Rules:
- Do not invent facts, names, decisions or deadlines.
- Include only information supported by the notes.
- If an owner or deadline is missing, say "Not specified".
- Preserve relative deadlines such as Friday or next week.
- Keep the language clear and professional.
- Return only a valid JSON object.
- All JSON values must be strings.
- Do not include markdown code fences.

Required JSON format:
{
    "summary": "Concise meeting summary",
    "decisions": "Numbered list of decisions",
    "actions": "Numbered list of action items",
    "responsibilities": "Tasks with owners and deadlines"
}

Meeting notes:
""" + notes

    url = (
        f"https://generativelanguage.googleapis.com/v1beta/"
        f"models/{MODEL}:generateContent"
    )

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json"
        }
    }

    try:
        response = requests.post(
            url,
            headers={
                "x-goog-api-key": API_KEY,
                "Content-Type": "application/json"
            },
            json=payload,
            timeout=90
        )

        if not response.ok:
            try:
                message = response.json().get(
                    "error", {}
                ).get("message", "Gemini API request failed.")
            except ValueError:
                message = "Gemini API request failed."

            return jsonify({"error": message}), 502

        result = response.json()

        candidates = result.get("candidates", [])
        if not candidates:
            raise ValueError("AI returned no response.")

        parts = candidates[0].get(
            "content", {}
        ).get("parts", [])

        text = "".join(
            part.get("text", "") for part in parts
        ).strip()

        # Remove optional markdown formatting
        text = re.sub(
            r"^```(?:json)?\s*|\s*```$",
            "",
            text,
            flags=re.IGNORECASE
        ).strip()

        minutes = json.loads(text)

        if not isinstance(minutes, dict):
            raise ValueError("Invalid AI response format.")

        required_fields = [
            "summary",
            "decisions",
            "actions",
            "responsibilities"
        ]

        output = {
            field: str(minutes.get(field) or "Not mentioned")
            for field in required_fields
        }

        return jsonify(output)

    except requests.Timeout:
        return jsonify({
            "error": "AI request timed out. Please try again."
        }), 504

    except (ValueError, json.JSONDecodeError, KeyError):
        return jsonify({
            "error": "Could not process the AI response."
        }), 502

    except requests.RequestException:
        return jsonify({
            "error": "Unable to connect to Gemini API."
        }), 502


if __name__ == "__main__":
    app.run(debug=True, port=5000)
