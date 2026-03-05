import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

const AI_DISCLAIMER =
  'AI supports matching and recommendations only; it does not make legal or employment decisions.';

// ── Simulated AI rating logic (deterministic mock) ────────────────────────────
function mockRateCV(text) {
  const wordCount = text.trim().split(/\s+/).length;
  const hasContact = /email|phone|\+\d|\@/i.test(text);
  const hasExperience = /experience|work|worked|developer|engineer|analyst|manager/i.test(text);
  const hasSkills = /skills?|proficient|expertise|python|react|excel|data|design/i.test(text);
  const hasEducation = /education|university|college|degree|bachelor|master|diploma/i.test(text);
  const hasLanguages = /english|french|arabic|swahili|language/i.test(text);

  let score = 30;
  if (wordCount >= 80) score += 10;
  if (wordCount >= 200) score += 10;
  if (hasContact) score += 15;
  if (hasExperience) score += 15;
  if (hasSkills) score += 10;
  if (hasEducation) score += 5;
  if (hasLanguages) score += 5;
  score = Math.min(score, 98);

  const suggestions = [];
  if (!hasContact) suggestions.push('Add your email address or phone number so employers can reach you.');
  if (!hasExperience) suggestions.push('Include a work experience or project section with specific responsibilities.');
  if (!hasSkills) suggestions.push('List your technical and soft skills — be specific (e.g., "Python", "team leadership").');
  if (!hasEducation) suggestions.push('Add an education section, even if informal (courses, certifications count).');
  if (!hasLanguages) suggestions.push('Mention the languages you speak and your proficiency level.');
  if (wordCount < 80) suggestions.push('Your CV seems short. Aim for at least 300–500 words to give employers a complete picture.');
  if (suggestions.length === 0) suggestions.push('Great structure! Consider adding measurable achievements (e.g., "Increased sales by 20%").');

  let label = 'Needs Work';
  let labelVariant = 'error';
  if (score >= 80) { label = 'Strong'; labelVariant = 'success'; }
  else if (score >= 60) { label = 'Good'; labelVariant = 'accent'; }
  else if (score >= 45) { label = 'Fair'; labelVariant = 'warning'; }

  return { score, label, labelVariant, suggestions };
}

// ── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 80 ? '#22c55e' : score >= 60 ? '#0d9488' : score >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-28 h-28 flex items-center justify-center shrink-0" aria-label={`CV score: ${score} out of 100`}>
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="text-center">
        <p className="text-2xl font-bold text-slate-100 leading-none">{score}</p>
        <p className="text-xs text-slate-500 mt-0.5">/ 100</p>
      </div>
    </div>
  );
}

// ── CV Rating page ────────────────────────────────────────────────────────────
export default function CVRating() {
  const [cvText, setCvText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [whyExpanded, setWhyExpanded] = useState(false);

  const handleCheck = () => {
    if (!cvText.trim()) return;
    setLoading(true);
    setResult(null);
    // Simulate async AI processing
    setTimeout(() => {
      setResult(mockRateCV(cvText));
      setLoading(false);
    }, 1800);
  };

  const handleReset = () => {
    setCvText('');
    setResult(null);
    setWhyExpanded(false);
  };

  return (
    <div className="space-y-8 motion-safe-fade-in max-w-2xl">
      {/* Page heading */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">CV Rating</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/12 text-teal-400 border border-teal-500/20">
            AI-Powered
          </span>
        </div>
        <p className="text-slate-400 text-base max-w-xl">
          Paste your CV text below and get instant feedback to improve your job application.
        </p>
      </div>

      {/* AI disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/6 border border-cyan-500/18">
        <svg className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-cyan-300 font-medium leading-relaxed">{AI_DISCLAIMER}</p>
      </div>

      {/* Input card */}
      {!result ? (
        <Card>
          <Card.Header>
            <h2 className="font-semibold text-slate-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Paste Your CV
            </h2>
            <p className="text-xs text-slate-500 mt-1">Copy and paste your full CV content into the box below. No files are stored.</p>
          </Card.Header>
          <Card.Body>
            <Textarea
              placeholder="Full Name&#10;Email: you@example.com | Phone: +254 700 000 000&#10;&#10;Work Experience&#10;Software Developer at TechCorp (2020–2023)&#10;- Built REST APIs with Python and Django&#10;- Led a team of 3 developers&#10;&#10;Skills&#10;Python, React, SQL, Team Leadership&#10;&#10;Education&#10;BSc Computer Science, University of Nairobi (2019)&#10;&#10;Languages&#10;English (fluent), French (intermediate)"
              rows={14}
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              aria-label="CV text input"
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-slate-600">
                {cvText.trim() ? `${cvText.trim().split(/\s+/).length} words` : 'Min. ~80 words recommended'}
              </p>
              <Button
                onClick={handleCheck}
                disabled={!cvText.trim() || cvText.trim().split(/\s+/).length < 5}
                loading={loading}
                className="min-w-[140px]"
              >
                {loading ? 'Analysing…' : 'Check Rating'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        /* Results card */
        <div className="space-y-5 motion-safe-fade-in">
          <Card className="border border-white/10">
            <Card.Header>
              <h2 className="font-semibold text-slate-100">Your CV Score</h2>
            </Card.Header>
            <Card.Body>
              <div className="flex items-center gap-6">
                <ScoreRing score={result.score} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant={result.labelVariant} className="text-sm px-3 py-1">
                      {result.label}
                    </Badge>
                    <span className="text-slate-400 text-sm">Overall strength</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {result.score >= 80
                      ? 'Excellent! Your CV is well-structured and likely to attract recruiter attention.'
                      : result.score >= 60
                      ? 'Good foundation. A few targeted improvements could significantly boost your match rate.'
                      : result.score >= 45
                      ? 'Your CV needs some work. Address the suggestions below to improve visibility.'
                      : 'Your CV needs significant improvement. Follow the tips below to get noticed.'}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Suggestions */}
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-slate-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Improvement Suggestions
              </h2>
            </Card.Header>
            <Card.Body>
              <ul className="space-y-3" role="list">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-cyan-500/12 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">{s}</p>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>

          {/* Why this rating — expandable */}
          <Card>
            <button
              onClick={() => setWhyExpanded(!whyExpanded)}
              aria-expanded={whyExpanded}
              className="w-full flex items-center justify-between text-left gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg"
            >
              <span className="font-semibold text-slate-100 text-sm">Why this rating?</span>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${whyExpanded ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {whyExpanded && (
              <div className="mt-4 space-y-3 motion-safe-fade-in text-sm text-slate-400 leading-relaxed">
                <p>
                  The score is calculated by analysing five key CV sections: <strong className="text-slate-300">contact info</strong>, <strong className="text-slate-300">work experience</strong>, <strong className="text-slate-300">skills</strong>, <strong className="text-slate-300">education</strong>, and <strong className="text-slate-300">languages</strong>. Each section found in your text contributes to the overall score.
                </p>
                <p>
                  <strong className="text-slate-300">Length</strong> also matters — a thorough CV with sufficient detail scores higher than a sparse one.
                </p>
                <p className="text-xs text-slate-500 italic border-t border-white/6 pt-3">
                  {AI_DISCLAIMER} This tool is for guidance only. Scores are illustrative and generated locally — your CV text is never sent to any server.
                </p>
              </div>
            )}
          </Card>

          {/* Privacy note */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/50 border border-white/6">
            <svg className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-400">Privacy:</strong> Your CV text is processed entirely in your browser. No data is transmitted to Sheltra servers or any third party. You can clear your input at any time.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleReset} variant="secondary">
              Check Another CV
            </Button>
            <Button variant="ghost" onClick={() => navigator.clipboard?.writeText(`CV Score: ${result.score}/100 (${result.label})\n\nSuggestions:\n${result.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`)}>
              Copy Results
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
