import { useState } from "react";
import "./App.css";

function HeroIllustration() {
  return (
    <svg
      className="hero-illustration"
      viewBox="0 0 520 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mh-sky" x1="40" y1="0" x2="480" y2="420" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e9d5ff" />
          <stop offset="0.45" stopColor="#fce7f3" />
          <stop offset="1" stopColor="#fed7aa" />
        </linearGradient>
        <linearGradient id="mh-hill" x1="260" y1="260" x2="260" y2="400">
          <stop stopColor="#c4b5fd" stopOpacity="0.35" />
          <stop offset="1" stopColor="#a5b4fc" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="504" height="404" rx="36" fill="url(#mh-sky)" />
      <ellipse cx="270" cy="360" rx="210" ry="48" fill="url(#mh-hill)" />
      <circle className="hero-svg-sun" cx="400" cy="96" r="44" fill="#fde68a" opacity="0.95" />
      <ellipse cx="120" cy="320" rx="56" ry="18" fill="#86efac" opacity="0.45" />
      <ellipse cx="400" cy="300" rx="48" ry="16" fill="#6ee7b7" opacity="0.35" />
      <g className="hero-svg-figure">
        <ellipse cx="230" cy="300" rx="72" ry="24" fill="#c7d2fe" opacity="0.55" />
        <path
          d="M230 200v72c0 24 20 44 44 44h8"
          stroke="#6366f1"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="230" cy="168" r="40" fill="#fef9c3" stroke="#fbbf24" strokeWidth="2.5" />
        <path
          d="M188 168c8-16 24-26 42-26s34 10 42 26"
          stroke="#475569"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.35"
        />
      </g>
      <circle className="hero-svg-dot" cx="100" cy="120" r="10" fill="#f472b6" opacity="0.65" />
      <circle className="hero-svg-dot hero-svg-dot--delay" cx="360" cy="200" r="8" fill="#818cf8" opacity="0.6" />
      <path
        className="hero-svg-leaf"
        d="M420 240c20-32 48-48 72-40-16 28-48 44-80 44-6-8-4-8 8-4z"
        fill="#34d399"
        opacity="0.55"
      />
    </svg>
  );
}

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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="navbar-inner">
          <a
            href="#home"
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
          >
            MindCare
          </a>

          <nav className="nav-links" aria-label="Main">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
              }}
            >
              Home
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("how-it-works");
              }}
            >
              How it works
            </a>
            <a
              href="#help"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("help");
              }}
            >
              Help
            </a>
            <a
              href="#resources"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("resources");
              }}
            >
              Resources
            </a>
          </nav>

          <div className="nav-auth">
            <button type="button" className="nav-login">
              Log in
            </button>
            <button type="button" className="nav-signup">
              Sign up
            </button>
          </div>
        </div>
      </header>

      <section className="hero hero--mindful" id="home">
        <div className="hero-bg" aria-hidden="true">
          <span className="blob blob--1" />
          <span className="blob blob--2" />
          <span className="blob blob--3" />
        </div>

        <div className="hero-inner">
          <div className="hero-content">
            <p className="hero-eyebrow">Mental wellness · Gentle screening</p>
            <h1>
              Take a breath.
              <span className="hero-title-accent"> Check in with yourself.</span>
            </h1>
            <p className="hero-lead">
              A calm, private space to reflect on how you have been feeling—and get a thoughtful risk
              snapshot in minutes. No judgment, just clarity.
            </p>
            <div className="hero-cta-row">
              <button type="button" className="primary-btn" onClick={() => setShowAssessment(true)}>
                Start assessment
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => scrollToSection("how-it-works")}
              >
                How it works
              </button>
            </div>
            <ul className="hero-trust">
              <li>
                <span className="hero-trust-dot" aria-hidden="true" />
                Anonymous
              </li>
              <li>
                <span className="hero-trust-dot" aria-hidden="true" />
                About 3 minutes
              </li>
              <li>
                <span className="hero-trust-dot" aria-hidden="true" />
                Not a diagnosis
              </li>
            </ul>
          </div>

          <div className="hero-visual-wrap">
            <div className="hero-visual">
              <HeroIllustration />
            </div>
            <div className="hero-float-card hero-float-card--a">
              <span className="hero-float-label">You matter</span>
              <span className="hero-float-value">Self-care first</span>
            </div>
            <div className="hero-float-card hero-float-card--b">
              <span className="hero-float-label">Private</span>
              <span className="hero-float-value">No account needed</span>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works section-wave" id="how-it-works">
        <div className="section-inner">
          <p className="section-eyebrow">Simple steps</p>
          <h2 className="section-title">How it works</h2>
          <p className="section-sub">
            Soft animations, clear words, and a flow designed to feel supportive—not clinical.
          </p>
          <div className="steps-container">
            <article className="step-card">
              <span className="step-num">01</span>
              <h3>Answer gentle prompts</h3>
              <p>Reflect on the last two weeks with plain-language questions you can complete at your pace.</p>
            </article>
            <article className="step-card">
              <span className="step-num">02</span>
              <h3>See an instant snapshot</h3>
              <p>Our model summarizes patterns in your responses into a simple risk level overview.</p>
            </article>
            <article className="step-card">
              <span className="step-num">03</span>
              <h3>Know your next step</h3>
              <p>Get guidance on self-care, talking to someone you trust, or reaching out to a professional.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-content section-inner">
          <p className="section-eyebrow">Why MindCare</p>
          <h2 className="section-title">Built to feel safe</h2>
          <p className="section-sub section-sub--center">
            Everything here is designed around privacy, speed, and kindness—so checking in never feels
            overwhelming.
          </p>
          <ul className="feature-grid">
            <li className="feature-tile">
              <span className="feature-icon" aria-hidden="true">
                01
              </span>
              <strong>Anonymous by design</strong>
              <p>We do not ask for personal details to run the screening.</p>
            </li>
            <li className="feature-tile">
              <span className="feature-icon" aria-hidden="true">
                02
              </span>
              <strong>Quick check-in</strong>
              <p>Most people finish in under three minutes.</p>
            </li>
            <li className="feature-tile">
              <span className="feature-icon" aria-hidden="true">
                03
              </span>
              <strong>Informed by ML</strong>
              <p>A model helps interpret your answers—always alongside human judgment for big decisions.</p>
            </li>
            <li className="feature-tile">
              <span className="feature-icon" aria-hidden="true">
                04
              </span>
              <strong>Early awareness</strong>
              <p>Notice strain sooner and take action while things still feel manageable.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-band-inner section-inner">
          <div className="cta-band-copy">
            <h2>Ready when you are</h2>
            <p>
              You can pause anytime. When you are ready, we will walk through the questions together.
            </p>
          </div>
          <button type="button" className="cta-band-btn" onClick={() => setShowAssessment(true)}>
            Begin screening
          </button>
        </div>
      </section>

      <section className="help-section" id="help">
        <div className="section-inner section-inner--narrow">
          <p className="section-eyebrow">If you need help now</p>
          <h2 className="section-title">Help</h2>
          <p>
            If you are in crisis or need immediate support, contact your local emergency services or a
            crisis helpline. MindCare is a screening tool—not therapy and not a substitute for
            professional care.
          </p>
        </div>
      </section>

      <section className="resources-section" id="resources">
        <div className="section-inner section-inner--narrow">
          <p className="section-eyebrow">Learn &amp; connect</p>
          <h2 className="section-title">Resources</h2>
          <p>
            Trusted organizations, self-help guides, and pathways to professional support will live
            here as we grow this library—so support is always one click away.
          </p>
        </div>
      </section>

      <section className="about section-soft" id="about">
        <div className="section-inner section-inner--narrow">
          <p className="section-eyebrow">Our story</p>
          <h2 className="section-title">About MindCare</h2>
          <p>
            MindCare exists to make mental health screening feel approachable. Distress often hides
            until it is loud—we hope a gentle, fast tool helps people notice sooner and choose their
            next step with confidence.
          </p>
        </div>
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
