import { useState } from "react";
import { profile } from "../content/profile";
import { links } from "../content/links";
import ResumeActions from "./ResumeViewer";
export default function ContactSection() {
  const [status, setStatus] = useState("");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setStatus("Email copied.");
    } catch {
      setStatus("Copy unavailable. Select the email address or use Email me.");
    }
  }
  return (
    <div className="contact-section">
      <p className="kicker">LET’S CONNECT</p>
      <h3 className="contact-heading">Let’s build something meaningful.</h3>
      <p className="section-lede">
        Open to thoughtful engineering conversations, collaborations and
        opportunities in full-stack, AI and data systems.
      </p>
      <div className="contact-actions">
        <a className="button primary" href={`mailto:${profile.email}`}>
          Email me
        </a>
        <a
          className="button"
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn ↗
        </a>
        <a
          className="button"
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
      </div>
      <p className="public-email">{profile.email}</p>
      <button className="copy-contact" onClick={copyEmail}>
        Copy email
      </button>
      <p role="status" className="contact-status">
        {status}
      </p>
      <ResumeActions />
      <p className="location-note">{profile.location}</p>
    </div>
  );
}
