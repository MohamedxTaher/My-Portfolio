import { useEffect, useRef, useState } from 'react';
import { ArrowRightIcon } from '../foundation/Icons';

/**
 * IncidentReplay — an illustrative, step-by-step replay of how SentinelPulse
 * turns a raw authentication log into a triage decision. Every value is
 * SAMPLE DATA (documentation-range IP, synthetic velocities), the module is
 * explicitly labeled as a demonstration, and it implies no live monitoring.
 * All six steps remain visible text at all times (the accessible equivalent);
 * running the demonstration only advances the highlight.
 */

type Step = { title: string; body: string };

const STEPS: Step[] = [
  {
    title: 'raw log // sample',
    body: 'Failed password for invalid user admin from 203.0.113.42 port 51422 ssh2',
  },
  {
    title: 'parser output // structured',
    body: '{ "source_ip": "203.0.113.42", "service": "ssh", "outcome": "failed", "user": "admin" }',
  },
  {
    title: 'detection rule // match',
    body: 'rule: ssh-brute-force — condition: 5+ failed authentications inside a 60s sliding window',
  },
  {
    title: 'mitre mapping // sample',
    body: 'brute force — credential access tactic',
  },
  {
    title: 'triage result // sample',
    body: 'severity: high — auth velocity: 22 failures / min',
  },
  {
    title: 'response step // sample',
    body: 'open tracking issue — notify analyst — workflow aligned with NIST SP 800-61',
  },
];

const STEP_MS = 850;

export function IncidentReplay() {
  const [reached, setReached] = useState(1);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    timer.current = window.setInterval(() => {
      setReached((current) => Math.min(current + 1, STEPS.length));
    }, STEP_MS);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [running]);

  // stop the interval once the end is reached
  useEffect(() => {
    if (reached >= STEPS.length) setRunning(false);
  }, [reached]);

  const run = () => {
    setReached(1);
    setRunning(true);
  };

  const complete = reached >= STEPS.length;

  return (
    <div className="replay">
      <div className="replay-head">
        <p className="kicker">incident replay // demonstration using sample data</p>
        <div className="replay-actions">
          <button
            type="button"
            className="replay-btn"
            onClick={complete ? run : () => setRunning((v) => !v)}
            aria-pressed={running}
          >
            {complete ? 'replay' : running ? 'pause' : 'run demonstration'}
            {!complete && !running && <ArrowRightIcon size={12} className="btn-arrow" />}
          </button>
          <button
            type="button"
            className="replay-btn replay-btn--ghost"
            onClick={() => {
              setRunning(false);
              setReached(1);
            }}
          >
            reset
          </button>
        </div>
      </div>

      <p className="replay-note mono mono--xs">
        sample values only (documentation-range ip, synthetic velocities) — not live monitoring
      </p>

      <ol className="replay-steps">
        {STEPS.map((step, i) => {
          const active = i < reached;
          return (
            <li className={`replay-step${active ? ' is-reached' : ''}`} key={step.title}>
              <span className="replay-step-num mono mono--xs" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="replay-step-title mono">{step.title}</p>
                <p className="replay-step-body" aria-current={active && i === reached - 1 ? 'step' : undefined}>
                  {step.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
