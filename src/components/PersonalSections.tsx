import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { profile } from "../content/profile";
import { education } from "../content/education";
import { experience } from "../content/experience";
import { achievements, publicAchievements } from "../content/achievements";
import { certifications } from "../content/certifications";
export function AboutSection() {
  return (
    <div className="about-content">
      <p className="section-lede">
        I’m Trunal, a Computer Engineering student in Mumbai, building at the
        intersection of full-stack development, AI and data.
      </p>
      <p>
        I’m interested in systems I can understand and explain: what the inputs
        mean, where the rules belong, and what happens when something fails.
      </p>
      <p className="professional-story">
        2x National-Level Hackathon Finalist. I bring the same collaborative
        problem-solving mindset to my engineering projects.
      </p>
      <section className="education-card">
        <GraduationCap size={30} strokeWidth={1.5} />
        <p className="kicker">EDUCATION</p>
        <h3>{education.institution}</h3>
        <strong>
          {education.degree} in {education.field}
        </strong>
        <p>{education.location}</p>
        <p className="education-dates">
          {education.start} — {education.end} <span>Expected graduation</span>
        </p>
        <div className="coursework">
          <BookOpen size={17} />
          <div>
            <h4>Relevant coursework</h4>
            <p>{education.coursework.join(" · ")}</p>
          </div>
        </div>
      </section>
      <section>
        <h3>How I’m growing</h3>
        <div className="timeline">
          {experience.map((e) => (
            <article key={e.title}>
              <p className="kicker">{e.year}</p>
              <h4>{e.title}</h4>
              <p>{e.body}</p>
            </article>
          ))}
        </div>
      </section>
      <a className="inline-route-link" href="#experience">
        Explore my Nitrix experience
        <ArrowUpRight size={16} />
      </a>
      <p className="quiet-note">
        {profile.educationDates}. Learning through coursework, practical
        projects and collaboration.
      </p>
    </div>
  );
}
export function AchievementsSection() {
  const publicCredentials = certifications.filter(
    (c) => c.visible && c.verified && c.url,
  );
  return (
    <div className="achievement-content">
      <p className="section-lede">
        A record is useful when it can be inspected. These are source-linked
        community milestones, with credentials added only when their public
        proof is available.
      </p>
      <section className="finalist-achievement">
        <p className="kicker">HACKATHON JOURNEY</p>
        <h3>
          {achievements.find((a) => a.id === "hackathon-finalist")?.title}
        </h3>
        <p>
          Building under constraints, collaborating across disciplines, and
          presenting working ideas.
        </p>
        <small>Owner-provided résumé statement · event records pending.</small>
      </section>
      <section>
        <h3>Community achievements</h3>
        {publicAchievements.map((a) => (
          <a
            className="achievement-proof"
            key={a.id}
            href={a.proofUrl!}
            target="_blank"
            rel="noreferrer"
          >
            <ShieldCheck size={22} />
            <div>
              <span className="kicker">
                MERGED UPSTREAM · {a.date?.slice(0, 10)}
              </span>
              <h4>{a.title}</h4>
              <p>{a.summary}</p>
              <span>Read the original contribution</span>
            </div>
            <ArrowUpRight size={17} />
          </a>
        ))}
      </section>
      <section className="credentials-section">
        <h3>Certifications</h3>
        {publicCredentials.length ? (
          publicCredentials.map((c) => (
            <a key={c.id} href={c.url!} target="_blank" rel="noreferrer">
              {c.name} · {c.issuer}
              <ArrowUpRight size={15} />
            </a>
          ))
        ) : (
          <div className="credential-empty">
            <span className="document-outline" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <strong>Evidence before badges.</strong>
            <p>
              Public issuer verification links will appear here when cleared for
              publication.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
