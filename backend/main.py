import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

stats = {
    "xp": 0,
    "correct": 0,
    "wrong": 0,
    "streak": 0
}


def clean_json(text):
    text = text.strip()
    text = text.replace("```json", "")
    text = text.replace("```", "")
    return text.strip()


@app.get("/")
def home():
    return {
        "project": "Revizo AI",
        "status": "Gemini AI Backend Running"
    }


@app.get("/generate-quiz")
def generate_quiz(topic: str = "python", question_count: int = 5):
    try:
        prompt = f"""
Create {question_count} MCQ questions on topic: {topic}.

Return ONLY valid JSON in this format:

{{
  "topic": "{topic}",
  "questions": [
    {{
      "question": "Question here",
      "options": ["A", "B", "C", "D"],
      "answer": "Correct option text"
    }}
  ]
}}
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        text = clean_json(response.text)
        return json.loads(text)

    except Exception as e:
        return {
            "topic": topic,
            "questions": [
                {
                    "question": f"Sample question for {topic}?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "answer": "Option A"
                }
            ],
            "error": str(e)
        }


@app.get("/check-answer")
def check_answer(user_answer: str, correct_answer: str):
    if user_answer.lower().strip() == correct_answer.lower().strip():
        stats["xp"] += 10
        stats["correct"] += 1
        stats["streak"] += 1

        return {
            "result": "correct",
            "message": "Correct +10 XP",
            "stats": stats
        }

    stats["wrong"] += 1
    stats["streak"] = 0

    return {
        "result": "wrong",
        "message": "Wrong Answer",
        "stats": stats
    }


@app.get("/stats")
def get_stats():
    return stats


@app.get("/notes")
def notes(topic: str = "python"):
    try:
        prompt = f"""
Create 5 short revision notes for topic: {topic}.

Return ONLY valid JSON in this format:

{{
  "topic": "{topic}",
  "notes": [
    "Point 1",
    "Point 2",
    "Point 3",
    "Point 4",
    "Point 5"
  ]
}}
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        text = clean_json(response.text)
        return json.loads(text)

    except Exception as e:
        return {
            "topic": topic,
            "notes": [
                f"{topic} ka basic revision point 1.",
                f"{topic} ka important concept samjho.",
                f"{topic} ke examples practice karo.",
                f"{topic} se MCQ solve karo.",
                f"{topic} ko daily revise karo."
            ],
            "error": str(e)
        }


@app.get("/teacher")
def teacher(topic: str = "python"):
    try:
        prompt = f"""
Explain topic '{topic}' like a friendly teacher in simple Hinglish.

Return ONLY valid JSON in this format:

{{
  "topic": "{topic}",
  "explanation": "simple explanation here"
}}
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        text = clean_json(response.text)
        return json.loads(text)

    except Exception as e:
        return {
            "topic": topic,
            "explanation": f"{topic} ek important topic hai. Isko simple examples ke saath samjho aur practice questions solve karo.",
            "error": str(e)
        }