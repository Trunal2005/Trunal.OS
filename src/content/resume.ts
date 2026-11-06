export interface ResumeAsset {
  url: string;
  filename: string;
}
export const resumeManifest = {
  path: "resume/Trunal_Patil_Resume_Public.pdf",
  approvedForPublic: true,
} as const;
declare const __PUBLIC_RESUME_EXISTS__: boolean;
export function resolveResumeAsset(
  approved: boolean,
  exists: boolean,
): ResumeAsset | null {
  return approved && exists
    ? {
        url: `${import.meta.env.BASE_URL}${resumeManifest.path}`,
        filename: "Trunal_Patil_Resume_Public.pdf",
      }
    : null;
}
export const publicResume = resolveResumeAsset(
  resumeManifest.approvedForPublic,
  typeof __PUBLIC_RESUME_EXISTS__ !== "undefined" && __PUBLIC_RESUME_EXISTS__,
);
