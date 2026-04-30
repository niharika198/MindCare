import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [showAssessment, setShowAssessment] = useState(false);
  const [answers, setAnswers] = useState(Array(16).fill(null));
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOptionSelect = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);
    
    // Auto-advance
    if (currentStep < 15) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 400);
    }
  };

  const handleNext = () => {
    if (currentStep < 15) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to restart the assessment?")) {
      setAnswers(Array(16).fill(null));
      setCurrentStep(0);
      setResult("");
    }
  };

  const handleSubmit = async () => {
    // Fill any skipped questions with 0 to prevent backend errors
    const finalAnswers = answers.map(a => a === null ? 0 : a);
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: finalAnswers }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error(err);
      setResult("Error processing request");
    }
    setLoading(false);
  };

  const isComplete = currentStep === 15 && answers[15] !== null;
  const progressPercent = ((currentStep + (answers[currentStep] !== null ? 1 : 0)) / 16) * 100;

  if (showAssessment) {
    return (
      <div className="assessment-container">
        <header className="assessment-header">
          <button className="back-btn" onClick={() => {setShowAssessment(false); setResult(""); setCurrentStep(0);}}>
            &larr; Back to Home
          </button>
          <h2>Mental Health Assessment</h2>
          <p className="subtitle">Answer a few simple questions to understand your mental health risk level</p>
        </header>

        <div className="questions-card">
          {!result ? (
            <>
              <div className="progress-section">
                <div className="progress-text">Question {currentStep + 1} of 16</div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>

              <div className="question-content fade-in">
                <h3>Question {currentStep + 1}</h3>
                <p className="question-prompt">Over the last 2 weeks, how often have you experienced this feeling or habit?</p>
                
                <div className="options-grid">
                  {[
                    { label: "Never", value: 0 },
                    { label: "Sometimes", value: 1 },
                    { label: "Often", value: 2 },
                    { label: "Always", value: 3 }
                  ].map((opt) => (
                    <label 
                      key={opt.value} 
                      className={`option-card ${answers[currentStep] === opt.value ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`q${currentStep}`}
                        value={opt.value}
                        checked={answers[currentStep] === opt.value}
                        onChange={() => handleOptionSelect(opt.value)}
                      />
                      <span className="radio-custom"></span>
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="navigation-buttons">
                <button 
                  className="nav-btn prev" 
                  onClick={handlePrev} 
                  disabled={currentStep === 0}
                >
                  Previous
                </button>
                
                {currentStep < 15 ? (
                  <button 
                    className="nav-btn next" 
                    onClick={handleNext} 
                    disabled={answers[currentStep] === null}
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    className="submit-btn final-submit" 
                    onClick={handleSubmit} 
                    disabled={loading || answers[15] === null}
                  >
                    {loading ? "Analyzing..." : "Submit Assessment"}
                  </button>
                )}
              </div>
              
              <div className="reset-container">
                <button className="reset-btn" onClick={handleReset}>Reset Assessment</button>
              </div>
            </>
          ) : (
            <div className={`result-box ${result.toLowerCase()}`}>
              <h3>Your Risk Level: {result}</h3>
              <p>
                {result === "Low" && "Your responses suggest a low risk. Keep up the good self-care! Stay mindful and healthy."}
                {result === "Medium" && "Your responses indicate some distress. Consider reaching out for support from a friend, family member, or a counselor."}
                {result === "High" && "Your responses suggest a high risk level. We strongly recommend speaking with a healthcare professional or therapist."}
                {result === "Error processing request" && "There was an issue processing your request. Please ensure the backend is running."}
              </p>
              <button className="nav-btn next" onClick={handleReset} style={{marginTop: "2rem"}}>
                Take Assessment Again
              </button>
            </div>
          )}
        </div>

        <p className="assessment-disclaimer">
          <strong>Note:</strong> This assessment is strictly anonymous and not a medical diagnosis.
        </p>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="logo">MindCare</div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Understand Your Mental Health Better</h1>
          <p>
            Take a quick, scientifically-backed assessment to check your mental health risk level. 
            A safe space for you to reflect and seek guidance.
          </p>
          <button className="primary-btn" onClick={() => setShowAssessment(true)}>
            Start Assessment
          </button>
        </div>
        <div className="hero-image">
          <img src="/hero-illustration.png" alt="Mental Wellness Illustration" />
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="icon">📝</div>
            <h3>Answer simple questions</h3>
            <p>Complete a short survey about your feelings and habits.</p>
          </div>
          <div className="step-card">
            <div className="icon">⚡</div>
            <h3>Get instant analysis</h3>
            <p>Our machine-learning model instantly evaluates your responses.</p>
          </div>
          <div className="step-card">
            <div className="icon">🌱</div>
            <h3>Receive guidance</h3>
            <p>Get actionable insights and know when to seek professional help.</p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-content">
          <h2>Why Use This?</h2>
          <ul className="feature-list">
            <li>
              <span className="check-icon">✓</span>
              <div>
                <strong>Anonymous and safe</strong>
                <p>We do not store your personal data.</p>
              </div>
            </li>
            <li>
              <span className="check-icon">✓</span>
              <div>
                <strong>Quick and easy</strong>
                <p>Takes less than 3 minutes to complete.</p>
              </div>
            </li>
            <li>
              <span className="check-icon">✓</span>
              <div>
                <strong>Based on machine learning</strong>
                <p>Driven by advanced algorithms for precise screening.</p>
              </div>
            </li>
            <li>
              <span className="check-icon">✓</span>
              <div>
                <strong>Early awareness support</strong>
                <p>Identify risks before they become harder to manage.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="about">
        <h2>About the Project</h2>
        <p>
          MindCare was created with the goal of making mental health screening more accessible. 
          Often, distress goes unnoticed until it becomes severe. By offering a quick, easy-to-use 
          tool, we hope to encourage early awareness and empower users to take charge of their mental well-being.
        </p>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p className="disclaimer">
            <strong>Disclaimer:</strong> This is not a medical diagnosis tool. If you are experiencing a crisis, please contact your local emergency services or a mental health professional immediately.
          </p>
          <div className="contact-info">
            <p>MindCare © 2026. All rights reserved.</p>
            <p>Contact: support@mindcare.example.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
