export interface Credential {
  id: string;
  name: string;
  issuer: string;
  url: string | null;
  verified: boolean;
  visible: boolean;
  source: string;
}
export const certifications: Credential[] = [
  {
    id: "oci-genai",
    name: "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
    issuer: "Oracle University",
    url: null,
    verified: false,
    visible: false,
    source: "Owner résumé; public issuer proof pending",
  },
  {
    id: "oci-ai",
    name: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    issuer: "Oracle University",
    url: null,
    verified: false,
    visible: false,
    source: "Owner résumé; public issuer proof pending",
  },
  {
    id: "full-stack",
    name: "Full Stack Web Development",
    issuer: "Skill Up",
    url: null,
    verified: false,
    visible: false,
    source: "Owner résumé; public issuer proof pending",
  },
  {
    id: "python",
    name: "Python",
    issuer: "Skill Up",
    url: null,
    verified: false,
    visible: false,
    source: "Owner résumé; public issuer proof pending",
  },
];
export const pendingCertifications = certifications
  .filter((c) => !c.verified)
  .map((c) => c.name);
