import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

import meditatingPerson from './meditating_person.png';

function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="mindcare-app">
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onAuthClick={(login) => { setIsLogin(login); setShowAuthModal(true); }} 
        />
        
        <Routes>
          <Route path="/" element={<LandingPage user={user} onStart={() => { setIsLogin(true); setShowAuthModal(true); }} />} />
          <Route path="/assessment" element={<AssessmentPage user={user} />} />
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
          <Route path="/resources" element={<ResourcesPage user={user} />} />
        </Routes>

        <Footer />

        {showAuthModal && (
          <AuthModal 
            isLogin={isLogin} 
            setIsLogin={setIsLogin} 
            onClose={() => setShowAuthModal(false)} 
            onSuccess={(data) => { 
              localStorage.setItem('user', JSON.stringify(data.user));
              localStorage.setItem('token', data.token);
              setUser(data.user); 
              setShowAuthModal(false); 
            }} 
          />
        )}
      </div>
    </Router>
  );
}

function Navbar({ user, onLogout, onAuthClick }) {
  const navigate = useNavigate();
  return (
    <nav className="serenity-navbar">
      <div className="nav-inner">
        <div className="nav-left" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
            </svg>
          </div>
          <span className="brand-name">MindCare</span>
        </div>
        
        <div className="nav-center">
          <Link to="/">Home</Link>
          {user && <Link to="/dashboard">Dashboard</Link>}
          {user && <Link to="/resources">Resources</Link>}
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-right">
          {user ? (
            <>
              <span className="user-greeting">Hi, {user.username}</span>
              <button className="nav-btn-login" onClick={onLogout}>Logout</button>
              <button className="nav-btn-start" onClick={() => navigate('/assessment')}>Start</button>
            </>
          ) : (
            <>
              <button className="nav-btn-login" onClick={() => onAuthClick(true)}>Login</button>
              <button className="nav-btn-start" onClick={() => onAuthClick(false)}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function LandingPage({ user, onStart }) {
  const navigate = useNavigate();
  const startAssessment = () => {
    if (user) navigate('/assessment');
    else onStart();
  };

  return (
    <div className="landing-page fade-in">
      <main className="serenity-hero">
        <div className="hero-inner">
          <div className="hero-content-left">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              A safe space to check in
            </div>
            <h1 className="hero-heading">
              Check Your <br />
              Mental <br />
              <span className="gradient-text">Well-being</span> <br />
              Instantly
            </h1>
            <p className="hero-subtext">
              Answer a few simple questions and understand your mental health risk level in a safe and private way.
            </p>
            <div className="hero-cta-group">
              <button className="cta-primary" onClick={startAssessment}>
                Start Assessment
              </button>
              {user && (
                <button className="cta-secondary" onClick={() => navigate('/dashboard')}>
                  View Dashboard →
                </button>
              )}
            </div>
          </div>
          <div className="hero-content-right">
            <div className="illustration-card glass-card">
              <img src={meditatingPerson} alt="Calm person meditating" className="hero-illustration float-1" />
            </div>
          </div>
        </div>
      </main>

      <section id="features" className="serenity-section features-section">
        <div className="section-inner">
          <div className="section-header">
            <h2>Why Choose MindCare?</h2>
            <p>Designed to provide a safe and supportive experience.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon" style={{background: 'rgba(96, 165, 250, 0.2)'}}>⏱️</div>
              <h3>Quick Assessment</h3>
              <p>Takes less than 2 minutes to complete the evaluation.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon" style={{background: 'rgba(52, 211, 153, 0.2)'}}>🔒</div>
              <h3>Private & Secure</h3>
              <p>Your responses are completely private and never stored.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon" style={{background: 'rgba(167, 139, 250, 0.2)'}}>⚡</div>
              <h3>Instant Results</h3>
              <p>Get immediate insights into your current well-being.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon" style={{background: 'rgba(250, 191, 106, 0.2)'}}>💡</div>
              <h3>Helpful Suggestions</h3>
              <p>Receive personalized tips based on your risk level.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="serenity-section cta-section">
        <div className="cta-inner glass-card">
          <h2>Your mental health matters.</h2>
          <p>Take the first step today.</p>
          <button className="cta-primary pulse-hover" onClick={startAssessment}>
            Start Your Assessment Now
          </button>
        </div>
      </section>
    </div>
  );
}

const ASSESSMENT_QUESTIONS = [
  "Little interest or pleasure in doing things?",
  "Feeling down, depressed, or hopeless?",
  "Trouble falling or staying asleep, or sleeping too much?",
  "Feeling tired or having little energy?",
  "Poor appetite or overeating?",
  "Feeling bad about yourself or that you are a failure?",
  "Trouble concentrating on things, such as reading the newspaper?",
  "Moving or speaking so slowly that other people could have noticed?",
  "Thoughts that you would be better off dead?",
  "Feeling nervous, anxious or on edge?",
  "Not being able to stop or control worrying?",
  "Worrying too much about different things?",
  "Trouble relaxing?",
  "Being so restless that it is hard to sit still?",
  "Becoming easily annoyed or irritable?",
  "Feeling afraid as if something awful might happen?"
];

const ZONES = [
  { name: "🌱 Start", range: [0, 3], color: "#eff6ff" },
  { name: "🌿 Calm Zone", range: [4, 7], color: "#ecfdf5" },
  { name: "🌊 Reflection", range: [8, 11], color: "#f5f3ff" },
  { name: "🌸 Balance", range: [12, 15], color: "#fff1f2" }
];

const EMOJI_OPTIONS = [
  { label: "Not at all", value: 0, emoji: "😊" },
  { label: "Several days", value: 1, emoji: "🙂" },
  { label: "More than half", value: 2, emoji: "😐" },
  { label: "Nearly every day", value: 3, emoji: "😞" }
];

const BUBBLE_OPTIONS = [
  { label: "Rarely", value: 0 },
  { label: "Sometimes", value: 1 },
  { label: "Often", value: 2 },
  { label: "Always", value: 3 }
];

const SEREN_PHRASES = [
  "You're doing well",
  "Let's continue gently",
  "You're doing a brave thing ✨",
  "Keep going, you matter 🌿",
  "I'm here with you 🤍",
  "Take your time, no rush"
];

function AssessmentPage({ user }) {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('welcome');
  const [answers, setAnswers] = useState(Array(16).fill(null));
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [xp, setXp] = useState(0);
  const [serenMessage, setSerenMessage] = useState("Hi! I'm Seren. Let's start our journey.");
  const [showXpGain, setShowXpGain] = useState(false);

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  const getCurrentZone = () => {
    return ZONES.find(z => currentStep >= z.range[0] && currentStep <= z.range[1]) || ZONES[0];
  };

  const handleOptionSelect = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);
    
    setXp(prev => prev + 10);
    setShowXpGain(true);
    
    const randomMsg = SEREN_PHRASES[Math.floor(Math.random() * SEREN_PHRASES.length)];
    setSerenMessage(randomMsg);

    setTimeout(() => {
      setShowXpGain(false);
      if (currentStep < 15) {
        if ((currentStep + 1) % 5 === 0) {
          setGameState('break');
        } else {
          setCurrentStep(prev => prev + 1);
        }
      } else {
        setGameState('finished');
        handleSubmit(newAnswers, xp + 10);
      }
    }, 800);
  };

  const handleSubmit = async (finalAnswers, finalXp) => {
    const numericAnswers = finalAnswers.map(a => a === null ? 0 : a);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          data: numericAnswers, 
          userId: user.id, 
          xp: finalXp 
        }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error(err);
      setResult('Error processing request');
    }
    setLoading(false);
  };

  const activeZone = getCurrentZone();

  if (gameState === 'welcome') {
    return (
      <div className="assessment-container fade-in">
        <div className="game-container glass-card pop-in">
          <div className="game-streak-badge">🔥 3 Day Streak</div>
          <h2 className="game-title">Ready for your Mental Wellness Journey? 🌿</h2>
          <div className="journey-preview">
            {ZONES.map((z, i) => (
              <div key={z.name} className="zone-node">
                <div className="zone-dot">{i + 1}</div>
                <span>{z.name}</span>
              </div>
            ))}
            <div className="zone-node"><div className="zone-dot">✨</div><span>Clarity</span></div>
          </div>
          <div className="breathing-container">
            <div className="breathing-circle">Breathe</div>
            <p>Take a deep breath. We'll explore together.</p>
          </div>
          <button className="cta-primary" onClick={() => setGameState('playing')}>Begin Journey</button>
        </div>
      </div>
    );
  }

  if (gameState === 'break') {
    return (
      <div className="assessment-container fade-in">
        <div className="game-container glass-card break-screen pop-in">
          <h2>Take a deep breath 🌬️</h2>
          <p>Pause for a moment. You've earned some calm points!</p>
          <div className="xp-badge">+50 Calm Points Bonus 🌿</div>
          <div className="breathing-container"><div className="breathing-circle">Exhale</div></div>
          <button className="cta-primary" onClick={() => {
            setXp(prev => prev + 50);
            setCurrentStep(prev => prev + 1);
            setGameState('playing');
          }}>Continue Journey</button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="assessment-container fade-in">
        <div className="game-container glass-card result-reveal-card pop-in">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <>
              <div className="confetti-effect">🎉 Journey Completed!</div>
              <h2>Wonderful job, {user?.username}! 💙</h2>
              <div className="final-xp">Total Calm Points: {xp} 🌿</div>
              <div className={`wellness-badge ${result?.toLowerCase()}`}>
                {result === "Low" ? "🌿 Balanced State" : result === "Medium" ? "🌼 Needs Attention" : "🔴 Support Recommended"}
              </div>
              <div className="risk-level-display">Risk Level: <strong>{result}</strong></div>
              <p className="result-text" style={{marginBottom: '2rem', marginTop: '1rem'}}>Your journey results have been saved to your dashboard.</p>
              <div className="hero-cta-group" style={{justifyContent: 'center'}}>
                <button className="cta-primary" onClick={() => navigate('/resources', { state: { result } })}>View Support Resources</button>
                <button className="cta-secondary" onClick={() => navigate('/dashboard')}>See Dashboard</button>
                <button className="cta-secondary" onClick={() => navigate('/')}>Back Home</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-container fade-in" style={{background: activeZone.color}}>
      <div className="game-container glass-card pop-in">
        <div className="game-stats-header">
          <div className="level-badge">{activeZone.name} • Level {currentStep + 1}</div>
          <div className="xp-counter">✨ {xp} Points</div>
        </div>
        <div className="progress-bar-bg" style={{marginBottom: '2rem'}}>
          <div className="progress-bar-fill" style={{ width: `${(currentStep / 16) * 100}%` }}></div>
        </div>
        <div className="companion-ai">
          <div className="seren-avatar">🌿</div>
          <div className="seren-bubble">{serenMessage}</div>
        </div>
        <h3 className="question-prompt" style={{fontSize: '1.5rem', minHeight: '4.5rem'}}>{ASSESSMENT_QUESTIONS[currentStep]}</h3>
        {currentStep % 4 === 1 ? (
          <div className="slider-interaction pop-in">
            <input type="range" min="0" max="3" step="1" value={answers[currentStep] || 0} onChange={(e) => handleOptionSelect(parseInt(e.target.value))} />
            <div className="slider-labels"><span>Rarely</span><span>Sometimes</span><span>Often</span><span>Always</span></div>
          </div>
        ) : currentStep % 4 === 2 ? (
          <div className="bubble-options-grid pop-in">
            {BUBBLE_OPTIONS.map(opt => <div key={opt.value} className="bubble-opt" onClick={() => handleOptionSelect(opt.value)}>{opt.label}</div>)}
          </div>
        ) : (
          <div className="emoji-options-grid pop-in">
            {EMOJI_OPTIONS.map((opt) => (
              <div key={opt.value} className={`emoji-card ${answers[currentStep] === opt.value ? 'selected' : ''}`} onClick={() => handleOptionSelect(opt.value)}>
                <span className="emoji-icon">{opt.emoji}</span>
                <span className="emoji-label">{opt.label}</span>
              </div>
            ))}
          </div>
        )}
        {showXpGain && <div className="xp-gain-popup animate-up">+10 XP</div>}
        <button className="back-btn" onClick={() => navigate('/')} style={{marginTop: '2rem', position: 'static', transform: 'none'}}>Exit Journey</button>
      </div>
    </div>
  );
}

function DashboardPage({ user }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5001/history/${user.id}`);
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchHistory();
  }, [user, navigate]);

  if (loading) return <div className="assessment-container"><div className="loading-spinner"></div></div>;

  return (
    <div className="dashboard-container fade-in">
      <div className="section-inner">
        <header className="dashboard-header">
          <h1>Welcome back, {user.username} 🌿</h1>
          <p>Track your mental wellness journey over time.</p>
        </header>

        <div className="stats-grid">
          <div className="stat-card glass-card">
            <h3>Total Journeys</h3>
            <div className="stat-value">{history.length}</div>
          </div>
          <div className="stat-card glass-card">
            <h3>Total Calm Points</h3>
            <div className="stat-value">{history.reduce((acc, curr) => acc + curr.xp, 0)}</div>
          </div>
          <div className="stat-card glass-card">
            <h3>Last Result</h3>
            <div className="stat-value">{history[0]?.result || "N/A"}</div>
          </div>
        </div>

        <h2 style={{margin: '3rem 0 1.5rem'}}>Journey History</h2>
        <div className="history-list">
          {history.length > 0 ? (
            history.map((item) => (
              <div key={item.id} className="history-item glass-card pop-in">
                <div className="history-info">
                  <span className="history-date">{new Date(item.timestamp).toLocaleDateString()}</span>
                  <span className={`history-result-tag ${item.result.toLowerCase()}`}>{item.result}</span>
                </div>
                <div className="history-xp">✨ {item.xp} XP</div>
              </div>
            ))
          ) : (
            <div className="empty-history glass-card">
              <p>You haven't completed any journeys yet.</p>
              <button className="cta-primary" onClick={() => navigate('/assessment')} style={{marginTop: '1rem'}}>Start First Journey</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResourcesPage({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [riskLevel, setRiskLevel] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!riskLevel);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (!riskLevel) {
      const fetchLatestResult = async () => {
        try {
          const res = await fetch(`http://localhost:5001/history/${user.id}`);
          const data = await res.json();
          if (data.length > 0) {
            setRiskLevel(data[0].result);
          } else {
            setRiskLevel('Low');
          }
        } catch (err) {
          console.error(err);
          setRiskLevel('Low');
        }
        setLoading(false);
      };
      fetchLatestResult();
    }
  }, [user, navigate, riskLevel]);

  const resources = {
    Low: {
      title: "Maintaining Your Well-being",
      description: "You're in a good place. Here are some globally recognized ways to keep your mental health strong and balanced.",
      articles: [
        { title: "WHO: Looking after our mental health", url: "https://www.who.int/campaigns/connecting-the-world-to-combat-coronavirus/healthyathome/healthyathome---mental-health" },
        { title: "NHS: 5 steps to mental wellbeing", url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/" }
      ],
      videos: [
        { title: "Headspace: Mindfulness for Beginners", url: "https://www.youtube.com/watch?v=inpok4MKVLM" },
        { title: "TED: The science of gratitude", url: "https://www.youtube.com/watch?v=WPPPFqsECz0" }
      ],
      tips: [
        "Stay physically active - even a 10-minute walk can boost your mood.",
        "Maintain a consistent sleep schedule to support brain health.",
        "Practice gratitude by noting 3 things you're thankful for each day."
      ]
    },
    Medium: {
      title: "Supporting Your Journey",
      description: "It's normal to feel a bit overwhelmed. These world-class resources can help you manage stress and regain balance.",
      articles: [
        { title: "NIMH: Tips for Managing Stress", url: "https://www.nimh.nih.gov/health/publications/so-stressed-out-fact-sheet" },
        { title: "Mind: How to manage anxiety", url: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/self-care/" }
      ],
      videos: [
        { title: "NHS: Progressive Muscle Relaxation", url: "https://www.youtube.com/watch?v=ihO02wUzgkc" },
        { title: "TED: How to make stress your friend", url: "https://www.youtube.com/watch?v=RcGyVTAoXEU" }
      ],
      tips: [
        "Try the 4-7-8 breathing technique when feeling overwhelmed.",
        "Limit caffeine and sugar, as they can mimic or worsen anxiety symptoms.",
        "Identify and write down your stress triggers to better understand them."
      ]
    },
    High: {
      title: "Guided Support & Care",
      description: "You're facing significant challenges, and seeking support is a sign of strength. Please utilize these authoritative resources.",
      articles: [
        { title: "NIMH: Help for Mental Illnesses", url: "https://www.nimh.nih.gov/health/find-help" },
        { title: "WHO: Mental Health in Emergencies", url: "https://www.who.int/news-room/fact-sheets/detail/mental-health-in-emergencies" }
      ],
      videos: [
        { title: "Psych Hub: When to see a therapist", url: "https://www.youtube.com/watch?v=u4v_7t909a0" },
        { title: "WHO: I had a black dog (Depression)", url: "https://www.youtube.com/watch?v=XiCrniLQGYc" }
      ],
      tips: [
        "Reach out to a mental health professional or a trusted doctor immediately.",
        "Save crisis hotline numbers in your phone for quick access.",
        "Focus on grounding: name 5 things you see, 4 things you can touch, and 3 things you hear."
      ]
    }
  };

  const content = resources[riskLevel] || resources.Low;

  if (loading) return <div className="assessment-container"><div className="loading-spinner"></div></div>;

  return (
    <div className="dashboard-container fade-in">
      <div className="section-inner">
        <header className="dashboard-header">
          <div className="hero-badge" style={{
            marginBottom: '1rem', 
            background: riskLevel === 'High' ? 'rgba(239, 68, 68, 0.1)' : riskLevel === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
            color: riskLevel === 'High' ? '#ef4444' : riskLevel === 'Medium' ? '#f59e0b' : '#10b981'
          }}>
             {riskLevel} Risk Resources
          </div>
          <h1>{content.title} 🌿</h1>
          <p>{content.description}</p>
        </header>

        <div className="resources-grid" style={{marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
           <section className="resource-section">
              <h2 style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem'}}>
                <span className="feature-icon" style={{background: 'rgba(96, 165, 250, 0.2)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px'}}>📄</span> 
                Helpful Articles
              </h2>
              <div className="history-list">
                {content.articles.map((art, i) => (
                  <a key={i} href={art.url} target="_blank" rel="noopener noreferrer" className="history-item glass-card pop-in" style={{textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'space-between', padding: '1.5rem', marginBottom: '1rem'}}>
                    <div className="history-info">
                      <span style={{fontWeight: '600'}}>{art.title}</span>
                    </div>
                    <div className="history-xp" style={{color: '#6366f1'}}>Read →</div>
                  </a>
                ))}
              </div>
           </section>

           <section className="resource-section">
              <h2 style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem'}}>
                <span className="feature-icon" style={{background: 'rgba(250, 191, 106, 0.2)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px'}}>🎬</span> 
                Recommended Videos
              </h2>
              <div className="history-list">
                {content.videos.map((vid, i) => (
                  <a key={i} href={vid.url} target="_blank" rel="noopener noreferrer" className="history-item glass-card pop-in" style={{textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'space-between', padding: '1.5rem', marginBottom: '1rem'}}>
                    <div className="history-info">
                      <span style={{fontWeight: '600'}}>{vid.title}</span>
                    </div>
                    <div className="history-xp" style={{color: '#f59e0b'}}>Watch →</div>
                  </a>
                ))}
              </div>
           </section>
        </div>

        <section className="tips-section" style={{marginTop: '4rem', padding: '2rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.1)'}}>
          <h2 style={{marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span style={{fontSize: '1.5rem'}}>💡</span> MindCare Tips
          </h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem'}}>
            {content.tips.map((tip, i) => (
              <div key={i} className="tip-card" style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                <div style={{background: '#6366f1', color: 'white', minWidth: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold'}}>
                  {i + 1}
                </div>
                <p style={{margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: '#4b5563'}}>{tip}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{marginTop: '4rem', textAlign: 'center'}}>
           <button className="cta-primary" onClick={() => navigate('/assessment')} style={{marginRight: '1rem'}}>Retake Journey</button>
           <button className="cta-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

function AuthModal({ isLogin, setIsLogin, onClose, onSuccess }) {
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = isLogin ? '/login' : '/signup';
    try {
      const res = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      });
      const data = await res.json();
      if (!res.ok) setAuthError(data.error || 'Authentication failed');
      else onSuccess(data);
    } catch (err) {
      setAuthError('Server error');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="auth-modal glass-card fade-in">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p>{isLogin ? 'Login to continue your journey' : 'Join MindCare anonymously with just a username'}</p>
        {authError && <div className="auth-error">{authError}</div>}
        <form onSubmit={handleAuthSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={authForm.username} 
              onChange={e => setAuthForm({...authForm, username: e.target.value})} 
              required 
              placeholder="Pick a unique username"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={authForm.password} 
              onChange={e => setAuthForm({...authForm, password: e.target.value})} 
              required 
              placeholder="Your secure password"
            />
          </div>
          <button type="submit" className="cta-primary submit-auth-btn">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <div className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => {setIsLogin(!isLogin); setAuthError('');}}>{isLogin ? 'Sign Up' : 'Login'}</span>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="serenity-footer" id="about">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="brand-name">MindCare</div>
          <p>A calming space for mental health awareness.</p>
        </div>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

export default App;
