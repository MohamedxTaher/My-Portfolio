/**
 * portfolio.ts — THE centralized content + config file.
 *
 * Portrait, CV, logo mark, and project previews enter as build-time `?url`
 * imports from the repository's asset folders (publicDir is disabled in
 * vite.config.ts); the raster imports point at optimized derivatives that are
 * visually identical to the originals kept next to them.
 */
import portraitUrl from '../../assets/new.webp?url';
import cvUrl from '../../assets/cv.pdf?url';
import logoMarkUrl from '../../assets/logo-mark.webp?url';
import project1PreviewUrl from '../../project_1/preview.webp?url';
import project2PreviewUrl from '../../project_2/preview.webp?url';
import project3PreviewUrl from '../../project_3/preview.webp?url';
import certCcepUrl from '../../assets/certifications/cert-ccep.webp?url';
import certCyberEngineerUrl from '../../assets/certifications/cert-cyber-security-engineer.webp?url';
import certWebFundamentalsUrl from '../../assets/certifications/cert-web-fundamentals.webp?url';
import certCcnaUrl from '../../assets/certifications/cert-ccna.webp?url';

/* -- profile ------------------------------------------------------------------ */

export const profile = {
  name: 'Mohamed Taher Elrefaey',
  title: 'Junior SOC Analyst | Incident Response Trainee | Blue Team',
  email: 'mohamedtaher5u@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mohamed-taherx',
  github: 'https://github.com/MohamedxTaher',

  /** WhatsApp: wa.me deep link (digits only, no + or spaces) + a display form. */
  whatsapp: 'https://wa.me/201096752626',
  whatsappDisplay: '+20 109 675 2626',

  intro:
    'Cybersecurity-focused analyst with hands-on SOC experience across SIEM monitoring, log analysis, and threat detection — currently completing incident response training.',
  deeperIntro: [
    'Day to day, that means building and investigating Wazuh SIEM environments, analyzing Windows Event Logs for signals like Event IDs 4624 and 4625, and investigating network traffic with Wireshark.',
    'I have also developed Python and PowerShell tools for security automation and log analysis, and I am continuing hands-on training centered on simulated attack scenarios, forensic evidence handling, and SOC operations.',
  ] as string[],

  /**
   * Personal mark with real alpha transparency (assets/logo-mark.webp,
   * lossless 372px WebP resize of assets/logo-mark.png; the original JPEG on
   * a white ground is kept on disk as the source record). Used by the header
   * and the summary aside so no white rectangle appears on dark surfaces.
   */
  logoMarkPath: logoMarkUrl,

  /** Asset files enter via ?url imports (configurable paths — never hard-coded in components). */
  portraitPath: portraitUrl,
  cvPath: cvUrl,

  contactInvite:
    "I'm currently open to junior SOC analyst, cybersecurity trainee, incident response, and blue team opportunities.",
} as const;

/* -- navigation ----------------------------------------------------------------- */

export const navigation = [
  { id: 'about', index: '01', label: 'About' },
  { id: 'experience', index: '02', label: 'Experience' },
  { id: 'certifications', index: '03', label: 'Certifications' },
  { id: 'skills', index: '04', label: 'Skills' },
  { id: 'projects', index: '05', label: 'Projects' },
  { id: 'contact', index: '06', label: 'Contact' },
] as const;

/** Stable id list for the active-section tracker. */
export const navigationIds: string[] = navigation.map((item) => item.id);

/* -- experience ------------------------------------------------------------------ */

/**
 * The single real experience entry — the DEPI incident response training
 * program (training, not employment). Summary, achievements, and methods are
 * the program's actual content, unchanged.
 */
export type ExperienceItem = {
  index: string;
  category: string;
  role: string;
  organization: string;
  period: string;
  location: string | null;
  mode: string | null;
  summary: string;
  achievements: string[];
  methods: string[];
  link: string | null;
};

export const experience: ExperienceItem[] = [
  {
    index: '01',
    category: 'Training',
    role: 'Cyber Security Incident Response Trainee',
    organization: 'Digital Egypt Pioneers Initiative (DEPI)',
    period: 'July 2026 – Present',
    location: 'Egypt',
    mode: null,
    summary:
      'Completed 200+ hours of hands-on training covering network fundamentals, operating system security, threat analysis, DFIR, and SOC operations.',
    achievements: [
      'Performed log analysis and alert triage across Windows and Linux endpoints, identifying suspicious authentication patterns and configuration anomalies.',
      'Used local LLMs (Ollama) to assist with SOC triage documentation and incident report drafting during lab exercises.',
      'Practiced forensic evidence collection, preservation, and documentation during simulated incident investigations.',
      'Collaborated with a team of 5 on a capstone project simulating an end-to-end attack and incident-response scenario.',
    ],
    methods: [
      'Log Analysis',
      'Alert Triage',
      'Windows & Linux Endpoints',
      'DFIR',
      'Local LLMs (Ollama)',
      'Forensic Evidence Collection',
    ],
    link: null,
  },
];

/* -- certifications ---------------------------------------------------------------- */

/**
 * Real credentials shown as their actual certificate images. Each entry
 * pairs the credential metadata with the optimized WebP derivative kept in
 * assets/certifications/. `year` is null when the year is not published.
 */
export type Certification = {
  index: string;
  category: string;
  title: string;
  issuer: string;
  year: string | null;
  status: string | null;
  imagePath: string;
};

export const certifications: Certification[] = [
  {
    index: '01',
    category: 'Networking',
    title: 'CCNA',
    issuer: 'Creativa Mansoura',
    year: '2025',
    status: null,
    imagePath: certCcnaUrl,
  },
  {
    index: '02',
    category: 'Blue Team',
    title: 'Certified Cybersecurity Educator Professional (CCEP)',
    issuer: 'Red Team Leaders',
    year: '2026',
    status: null,
    imagePath: certCcepUrl,
  },
  {
    index: '03',
    category: 'SOC & Engineering',
    title: 'Cyber Security Engineer Job Profile',
    issuer: 'Mahara-Tech / ITI',
    year: '2026',
    status: null,
    imagePath: certCyberEngineerUrl,
  },
  {
    index: '04',
    category: 'Web Security',
    title: 'Web Fundamentals (Legacy)',
    issuer: 'TryHackMe',
    year: '2026',
    status: null,
    imagePath: certWebFundamentalsUrl,
  },
];

/* -- skills ----------------------------------------------------------------------- */

/**
 * Groups restricted to the real security/SOC content (never generic
 * frontend/backend categories). `level` is a design-level SELF-ASSESSED
 * estimate (1 Familiar · 2 Working · 3 Comfortable); the UI labels every
 * level as self-assessed.
 */
export type SkillLevel = 1 | 2 | 3;

export const skillLevels: Record<SkillLevel, string> = {
  1: 'Familiar',
  2: 'Working',
  3: 'Comfortable',
};

export type SkillItem = { name: string; level: SkillLevel };

export type SkillGroup = {
  index: string;
  name: string;
  items: SkillItem[];
};

export const skills: SkillGroup[] = [
  {
    index: '01',
    name: 'Security Operations & Incident Response',
    items: [
      { name: 'Alert Triage', level: 3 },
      { name: 'SIEM Monitoring (Wazuh)', level: 3 },
      { name: 'Log Analysis', level: 3 },
      { name: 'Windows Event Logs', level: 3 },
      { name: 'IOC Identification', level: 2 },
      { name: 'Incident Documentation', level: 2 },
      { name: 'Basic Incident Response', level: 1 },
      { name: 'Threat Detection', level: 2 },
      { name: 'Security Monitoring', level: 2 },
      { name: 'Forensic Evidence Handling', level: 2 },
    ],
  },
  {
    index: '02',
    name: 'Network Security',
    items: [
      { name: 'TCP/IP', level: 2 },
      { name: 'DNS', level: 2 },
      { name: 'HTTP/HTTPS', level: 2 },
      { name: 'ICMP', level: 2 },
      { name: 'Subnetting', level: 2 },
      { name: 'VLANs', level: 2 },
      { name: 'Inter-VLAN Routing', level: 2 },
      { name: 'ACLs', level: 2 },
      { name: 'Network Traffic Analysis', level: 2 },
      { name: 'Wireshark Packet Analysis', level: 3 },
    ],
  },
  {
    index: '03',
    name: 'Security Tools',
    items: [
      { name: 'Wazuh SIEM', level: 3 },
      { name: 'Wireshark', level: 3 },
      { name: 'Cisco Packet Tracer', level: 2 },
      { name: 'Git', level: 2 },
      { name: 'GitHub', level: 2 },
      { name: 'Ollama', level: 2 },
    ],
  },
  {
    index: '04',
    name: 'Operating Systems',
    items: [
      { name: 'Windows Security & Authentication', level: 3 },
      { name: 'Linux CLI', level: 2 },
      { name: 'File Permissions', level: 2 },
      { name: 'Process Management', level: 2 },
      { name: 'Syslog Analysis', level: 2 },
    ],
  },
  {
    index: '05',
    name: 'Scripting & Automation',
    items: [
      { name: 'Python (Regex, Log Parsing, CSV/JSON Automation)', level: 3 },
      { name: 'PowerShell', level: 2 },
      { name: 'Bash', level: 2 },
    ],
  },
  {
    index: '06',
    name: 'Frameworks & Concepts',
    items: [
      { name: 'MITRE ATT&CK Basics', level: 1 },
      { name: 'Cyber Kill Chain', level: 2 },
      { name: 'Defense in Depth', level: 2 },
      { name: 'SOC Tier 1 Operations', level: 2 },
    ],
  },
];

/* -- projects ---------------------------------------------------------------------- */

/**
 * One entry per real project. Descriptions, highlights, and tags come from
 * each project's own documentation, unchanged. No live URLs exist for any
 * project → `liveUrl` is null everywhere and no such claim is rendered.
 */
export type Project = {
  index: string;
  category: string;
  title: string;
  description: string;
  highlights: { name: string; detail: string }[];
  tags: string[];
  sourceUrl: string;
  liveUrl: string | null;
  previewPath: string;
};

export const projects: Project[] = [
  {
    index: '01',
    category: 'SOC Analytics',
    title: 'SentinelPulse-SOC',
    description:
      'SentinelPulse-SOC is a Python-based security analytics pipeline designed to automate log normalization, threat detection, and alert enrichment. It ingests raw Syslog, Apache, and SSH telemetry, correlating security events against the MITRE ATT&CK framework to help analysts rapidly triage threats and minimize response time.',
    highlights: [
      {
        name: 'Multi-Source Telemetry Ingestion',
        detail:
          'Parses and normalizes unstructured Syslog, Apache, and SSH auth logs into structured JSON feeds without silent data drops.',
      },
      {
        name: 'MITRE ATT&CK Detection Engine',
        detail:
          'Correlates security events against 15 custom YAML rules across 7 adversary tactics, enforcing status-code constraints, deduplication, and severity scoring.',
      },
      {
        name: 'Sliding-Window Rate Analysis',
        detail:
          'Implements an O(N) two-pointer algorithm to measure authentication velocity, distinguishing high-density brute-force attacks from low-and-slow login attempts.',
      },
      {
        name: 'Threat Intel & Automated IR',
        detail:
          'Integrates AbuseIPDB API reputation scoring, IOC hash matching, and automated GitHub Actions workflows aligned with NIST SP 800-61 playbooks.',
      },
    ],
    tags: ['Python', 'YAML', 'AbuseIPDB API', 'MITRE ATT&CK', 'PyTest', 'GitHub Actions', 'NIST SP 800-61'],
    sourceUrl: 'https://github.com/MohamedxTaher/SentinelPulse-SOC',
    liveUrl: null,
    previewPath: project1PreviewUrl,
  },
  {
    index: '02',
    category: 'SIEM Platform',
    title: 'VanguardSOC',
    description:
      'VanguardSOC is a production-ready SIEM system designed to mirror enterprise workflows found in tools like Wazuh and Splunk. It ingests raw Syslog and Nginx events, normalizes them through a two-stage regex parser, and runs time-windowed correlation rules to detect critical threats in real time. Built with a FastAPI backend and a custom SOC command dashboard, the system features JWT-secured RBAC, Prometheus/Grafana telemetry, and automated database migrations — fully containerized via Docker Compose.',
    highlights: [],
    tags: ['FastAPI', 'JWT', 'Prometheus', 'Grafana', 'Docker Compose'],
    sourceUrl: 'https://github.com/MohamedxTaher/VanguardSOC',
    liveUrl: null,
    previewPath: project2PreviewUrl,
  },
  {
    index: '03',
    category: 'Threat Intelligence',
    title: 'Vigilant-IOC',
    description:
      'Vigilant-IOC is a Python tool designed to automate the extraction, enrichment, and analysis of Indicators of Compromise (IOCs) — such as IP addresses, malicious domains, URLs, and file hashes. It streamlines threat triage, helping SOC analysts quickly separate noise from actionable security alerts during incident response.',
    highlights: [
      {
        name: 'Automated IOC Enrichment',
        detail:
          'Parses raw IOCs and cross-references them against threat intelligence sources to categorize risk instantly.',
      },
      {
        name: 'DevSecOps Integration',
        detail: 'Automated CI/CD workflows built with GitHub Actions and code linting to enforce clean, maintainable code.',
      },
      {
        name: 'Test-Driven Reliability',
        detail: 'Includes a structured unit-testing suite and clear guide to ensure reliable execution in production environments.',
      },
      {
        name: 'Operational Readiness',
        detail:
          'Configured with environment isolation (.env), a standardized Makefile build setup, and an explicit security reporting policy.',
      },
    ],
    tags: ['Python', 'GitHub Actions', 'Makefile', 'PyTest', 'Threat Intel API Integration'],
    sourceUrl: 'https://github.com/MohamedxTaher/Vigilant-IOC',
    liveUrl: null,
    previewPath: project3PreviewUrl,
  },
];

/* -- about: metrics + traits ---------------------------------------------------------- */

export type Metric = { value: string; label: string };

export const metrics: Metric[] = [
  {
    value: '200+',
    label: 'hours of hands-on SOC training',
  },
  {
    value: '4',
    label: 'verified certifications',
  },
  {
    value: '3',
    label: 'hands-on security projects',
  },
];

/** Feature-row traits implied by the real experience content. */
export const traits: string[] = [
  'Log Analysis',
  'Alert Triage',
  'Incident Response',
  'DFIR',
  'Forensic Evidence Handling',
];
