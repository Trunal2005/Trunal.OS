export interface ExperienceRole {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  context: string;
  responsibilities: { title: string; body: string }[];
  pipeline: { id: string; name: string; description: string }[];
  transferable: string[];
  evidence: string[];
  approvedMetrics: string[];
  approvedClients: string[];
  visible: boolean;
}
export const roles: ExperienceRole[] = [
  {
    id: "nitrix",
    company: "Nitrix Talent Media",
    role: "Co-Founder & Chief Marketing Officer",
    start: "March 2025",
    end: "Present",
    context:
      "Building the relationships and operating rhythm behind creator partnerships and campaign work. An entrepreneurial role alongside my engineering education.",
    responsibilities: [
      {
        title: "Creator partnerships",
        body: "Creator outreach, relationship building and communication across collaboration opportunities.",
      },
      {
        title: "Negotiation & alignment",
        body: "Coordinate expectations, deliverables and stakeholder discussions.",
      },
      {
        title: "Campaign coordination",
        body: "Bring people, content plans and campaign stages into a clear operating workflow.",
      },
      {
        title: "Performance analysis",
        body: "Review campaign engagement and reach to inform subsequent decisions.",
      },
      {
        title: "Business development",
        body: "Explore partnership opportunities and support the growth of the business.",
      },
    ],
    pipeline: [
      {
        id: "outreach",
        name: "Outreach",
        description:
          "Understand the creator, the audience and the collaboration context.",
      },
      {
        id: "alignment",
        name: "Alignment",
        description:
          "Discuss expectations, negotiate and clarify the shared brief.",
      },
      {
        id: "coordination",
        name: "Coordination",
        description: "Keep stakeholders, content and delivery plans connected.",
      },
      {
        id: "analysis",
        name: "Analysis",
        description:
          "Review campaign signals and carry lessons into the next brief.",
      },
    ],
    transferable: [
      "Stakeholder communication",
      "Negotiation",
      "Team coordination",
      "Analytical thinking",
      "Business development",
    ],
    evidence: [
      "Latest owner résumé transcription",
      "Local April 2026 résumé",
      "Previous public portfolio Nitrix entry",
    ],
    approvedMetrics: [],
    approvedClients: [],
    visible: true,
  },
];
// Keep the chronological content separate from professional roles.
export const experience = [
  {
    year: "2024 — 2028 expected",
    title: "Computer Engineering at VIT",
    body: "Learning algorithms, object-oriented programming and databases while building practical systems.",
    source: "Owner résumé",
  },
  {
    year: "Ongoing",
    title: "Build, inspect, improve.",
    body: "Exploring full-stack, AI and data systems through public projects.",
    source: "Project repositories",
  },
  {
    year: "Ongoing",
    title: "Contribute upstream.",
    body: "Working on concrete correctness and reliability fixes in shared software.",
    source: "Verified PR snapshot",
  },
];
