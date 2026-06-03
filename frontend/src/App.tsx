import { useEffect, useState } from "react";
import "./App.css";

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

function App() {
  const [questionCount, setQuestionCount] = useState(10);
  const [videoLink, setVideoLink] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [message, setMessage] = useState("");

  const [stats, setStats] = useState({
    xp: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
  });

  const [showTeacher, setShowTeacher] = useState(false);
  const [teacherText, setTeacherText] = useState("");

  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);

  async function loadStats() {
    const res = await fetch("http://127.0.0.1:8001/stats");
    const data = await res.json();
    setStats(data);
  }

  async function generateQuiz() {
    const res = await fetch(
      `http://127.0.0.1:8001/generate-quiz?topic=${videoLink}&question_count=${questionCount}`
    );

    const data = await res.json();

    setQuestions(data.questions);
    setCurrentQuestion(0);
    setMessage("Quiz generated successfully!");
  }

  async function checkAnswer(option: string) {
    if (questions.length === 0) return;

    const correctAnswer = questions[currentQuestion].answer;

    const res = await fetch(
      `http://127.0.0.1:8001/check-answer?user_answer=${option}&correct_answer=${correctAnswer}`
    );

    const data = await res.json();

    setMessage(data.message);
    setStats(data.stats);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setMessage("");
      }
    }, 800);
  }

  async function loadNotes() {
    const res = await fetch("http://127.0.0.1:8001/notes");
    const data = await res.json();
    setNotes(data.notes);
    setShowNotes(true);
  }

  async function loadTeacher() {
    const res = await fetch("http://127.0.0.1:8001/teacher");
    const data = await res.json();
    setTeacherText(data.explanation);
    setShowTeacher(true);
  }

  useEffect(() => {
    loadStats();
  }, []);

  const activeQuestion = questions[currentQuestion];

  const accuracy =
    stats.correct + stats.wrong > 0
      ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100)
      : 0;

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">Revizo AI</div>

        <div className="nav-links">
          <a>Features</a>
          <a>Exams</a>
          <a>Dashboard</a>
        </div>

        <button className="nav-btn">Start Free</button>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <p className="badge">AI Revision Platform</p>

          <h1>
            Watch. Revise.
            <span> Master.</span>
          </h1>

          <p className="hero-text">
            Revizo AI converts educational videos into smart revision quizzes,
            tracks your XP, accuracy, weak topics and helps you master concepts
            faster.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Start Learning</button>
            <button className="secondary-btn">View Demo</button>
          </div>

          <div className="revision-box">
            <h3>Choose Your Revision Mode</h3>

            <div className="question-options">
              {[5, 10, 15, 20, 25].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={questionCount === count ? "active-option" : ""}
                >
                  {count} Questions
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Paste YouTube Video Link"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="video-input"
            />

            <button className="generate-btn" onClick={generateQuiz}>
              Generate Quiz
            </button>

            <div className="ai-tools">
              <button onClick={loadNotes}>📝 Generate Notes</button>
              <button onClick={loadTeacher}>🤖 Ask AI Teacher</button>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <div className="video-preview">
            <div className="play-btn">▶</div>
            <p>JEE Physics - Electrostatics</p>
          </div>

          <div className="quiz-preview">
            <div className="quiz-top">
              <b>⚡ AI Revision Quiz</b>
              <span>{questionCount} Questions</span>
            </div>

            <h3>
              {activeQuestion
                ? activeQuestion.question
                : "Click Generate Quiz to start"}
            </h3>

            {activeQuestion ? (
              activeQuestion.options.map((option, index) => (
                <button key={index} onClick={() => checkAnswer(option)}>
                  {option}
                </button>
              ))
            ) : (
              <>
                <button>Option 1</button>
                <button>Option 2</button>
                <button>Option 3</button>
              </>
            )}

            <p className="success">{message || `XP: ${stats.xp}`}</p>
          </div>
        </div>
      </section>

      <section className="stats">
        <div>
          <h2>{stats.correct + stats.wrong}</h2>
          <p>Questions Solved</p>
        </div>

        <div>
          <h2>{accuracy}%</h2>
          <p>Accuracy</p>
        </div>

        <div>
          <h2>{stats.streak}</h2>
          <p>Day Streak</p>
        </div>

        <div>
          <h2>{stats.xp}</h2>
          <p>XP Earned</p>
        </div>
      </section>

      <section className="features">
        <h2>Why Revizo AI?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>🎯 Topic Detection</h3>
            <p>AI understands the topic of educational videos.</p>
          </div>

          <div className="feature-card">
            <h3>🧠 Smart Quiz</h3>
            <p>Generates important questions for revision.</p>
          </div>

          <div className="feature-card">
            <h3>🔥 XP System</h3>
            <p>Correct answers increase XP, level and streak.</p>
          </div>

          <div className="feature-card">
            <h3>📊 Weak Topics</h3>
            <p>Tracks mistakes and shows weak chapters.</p>
          </div>
        </div>
      </section>

      <section className="exams">
        <h2>Built For</h2>

        <div className="exam-tags">
          <span>JEE</span>
          <span>NEET</span>
          <span>UPSC</span>
          <span>GATE</span>
          <span>DSA</span>
          <span>Python</span>
          <span>ML / AI</span>
        </div>
      </section>

      {showTeacher && (
        <div className="teacher-modal">
          <div className="teacher-box">
            <h2>🤖 AI Teacher</h2>
            <p>{teacherText}</p>
            <button onClick={() => setShowTeacher(false)}>Close</button>
          </div>
        </div>
      )}

      {showNotes && (
        <div className="notes-modal">
          <div className="notes-box">
            <h2>📝 Quick Revision Notes</h2>

            <ul>
              {notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>

            <button onClick={() => setShowNotes(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;