
export const profile = {
  name: "Randy Lopez",
  title: "Software Engineer",
  handle: "github.com/quantyle",
  location: "New York, NY",
  tagline:
    "I build AI infrastructure, trading systems, and the frontends that make them usable.",
};

export const about = {
  paragraphs: [
    "Randy Lopez is a software engineer based in New York City, known for his work in algorithmic trading, artificial intelligence, and UI/UX design. He has over a decade of software engineering experience and currently serves as a VP of Engineering at a finance firm.",
  ],
};

export const projects = [
  {
    name: "quantyle-ide",
    year: "C#",
    blurb:
      "An IDE and purpose-built programming language for algorithmic crypto trading — write, test, and run strategies in one place.",
    stack: ["C#", ".NET", "Algorithmic trading", "DSL"],
    link: "https://github.com/quantyle/quantyle-ide",
    stars: 6,
    forks: 2,
  },
  {
    name: "coinbase-correlation-analysis",
    year: "Jupyter",
    blurb:
      "Computes correlation matrices for price and volume movements across markets on Coinbase Pro — a research tool for spotting relationships and pairs.",
    stack: ["Python", "Jupyter", "Pandas", "Coinbase API"],
    link: "https://github.com/quantyle/coinbase-correlation-analysis",
    stars: 3,
    forks: 1,
  },
  {
    name: "CAN-Shark",
    year: "C++",
    blurb:
      "Talks to a Toyota Prius over its CAN bus using Python and Arduino — reverse-engineering vehicle messages from the hardware up.",
    stack: ["C++", "Python", "Arduino", "CAN bus"],
    link: "https://github.com/quantyle/CAN-Shark",
    stars: 19,
    forks: 1,
  },
  {
    name: "augmented-reality-opencv",
    year: "C++",
    blurb:
      "Renders videos onto moving targets in real time using SURF keypoint detection and tracking — a hands-on dive into classic computer vision.",
    stack: ["C++", "OpenCV", "Computer vision"],
    link: "https://github.com/quantyle/augmented-reality-opencv",
    stars: 4,
    forks: 0,
  },
];

export const languages = [
  "Python",
  "JavaScript",
  "C/C++",
  "C#",
  "Java",
  "Go",
  "Rust",
  "SQL",
  "PHP",
  "Bash",
  "HTML",
  "CSS",
];

export const education = [
  {
    role: "B.S. Computer Engineering",
    org: "Florida Polytechnic University",
    period: "2018",
  },
];

export const experience = [
  {
    role: "VP of Engineering",
    org: "Tilden Park Capital Management LP",
    period: "2023 — Present",
    note: "Lead engineering at a finance firm. Building AI infrastructure — RAG and vector search, model serving with Hugging Face TGI, and AI pipelines on Google Genkit — alongside low-latency trading systems and the frontends the team works in.",
  },
  {
    role: "CEO, Software Engineer",
    org: "Quantyle LLC",
    period: "May 2019 — Sep 2023",
    note: "Founded Quantyle and built its algorithmic-trading platform end to end: a custom trading IDE and DSL, a Python matching engine, and market-research tooling — much of it open-sourced at github.com/quantyle.",
  },
  {
    role: "CEO, Software Engineer",
    org: "Logentix LLC",
    period: "2016 — 2019",
    note: "Ran Logentix as CEO while engineering the product hands-on across the fullstack, from frontend to backend services.",
  },
  {
    role: "Staff Scientist",
    org: "University of Florida",
    period: "Jul 2014 — Aug 2015",
    note: "Research staff role supporting scientific computing and lab work.",
  },
];

export const contact = {
  email: "randy@quantyle.io",
  links: [
    ["GitHub", "github.com/quantyle", "https://github.com/quantyle"],
    [
      "LinkedIn",
      "in/randy-lopez",
      "https://www.linkedin.com/in/randy-lopez-a25783b9",
    ],
  ],
  note: "Open to work and collaboration in AI infrastructure, frontend engineering, and fintech. GitHub and LinkedIn are the best places to reach me.",
};
