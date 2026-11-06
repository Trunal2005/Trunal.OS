import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  Expand,
  X,
  ZoomIn,
  ZoomOut,
  ImageOff,
} from "lucide-react";
import {
  mediaUrl,
  mediaLabel,
  usableProjectMedia,
  type ProjectMedia,
} from "../content/project-media";
import type { Project } from "../content/projects";

function MediaImage({
  media,
  full = false,
  priority = false,
}: {
  media: ProjectMedia;
  full?: boolean;
  priority?: boolean;
}) {
  const [retryPng, setRetryPng] = useState(false),
    [failed, setFailed] = useState(false),
    [loaded, setLoaded] = useState(false);
  if (failed)
    return (
      <div className="media-failure" role="status">
        <ImageOff size={26} />
        <strong>Screenshot unavailable.</strong>
        <p>The case study and source link are still available.</p>
      </div>
    );
  return (
    <>
      {!loaded && <span className="media-loading" role="status">Loading screenshot…</span>}
      <picture>
        {!retryPng && (
          <source
            type="image/webp"
            srcSet={mediaUrl(full ? media.fullSrc : media.src)}
          />
        )}
        <img
          src={mediaUrl(media.fallbackSrc)}
          alt={media.alt}
          width={full && !retryPng ? media.fullWidth : media.width}
          height={full && !retryPng ? media.fullHeight : media.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => (retryPng ? setFailed(true) : setRetryPng(true))}
        />
      </picture>
      {full && retryPng && (
        <p role="status" className="media-fallback-note">
          Full-resolution image unavailable. Showing the verified preview.
        </p>
      )}
    </>
  );
}
function MediaLightbox({
  items,
  index,
  name,
  onIndex,
  onClose,
}: {
  items: ProjectMedia[];
  index: number;
  name: string;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    viewport = useRef<HTMLDivElement>(null);
  const title = useId(),
    caption = useId();
  const [zoom, setZoom] = useState(false);
  const media = items[index];
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    setZoom(false);
    viewport.current?.scrollTo(0, 0);
  }, [index]);
  function change(next: number) {
    onIndex((next + items.length) % items.length);
  }
  return createPortal(
    <dialog
      ref={ref}
      className="screenshot-lightbox"
      aria-labelledby={title}
      aria-describedby={caption}
      onCancel={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Tab") {
          const targets = Array.from(
            ref.current?.querySelectorAll<HTMLElement>(
              'button:not([disabled]), [tabindex="0"]',
            ) ?? [],
          );
          const first = targets[0],
            last = targets[targets.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
        if (e.key === "Escape") e.stopPropagation();
        if (
          zoom &&
          e.target === viewport.current &&
          (e.key === "ArrowLeft" || e.key === "ArrowRight")
        )
          return;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          change(index + 1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          change(index - 1);
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <header className="lightbox-toolbar">
        <div>
          <span>
            {mediaLabel(media.kind).toUpperCase()} / {index + 1} OF{" "}
            {items.length}
          </span>
          <h2 id={title}>
            {name} — {media.title}
          </h2>
        </div>
        <button onClick={onClose} aria-label="Close screenshot">
          <X size={23} />
        </button>
      </header>
      <div className="lightbox-actions">
        <button aria-pressed={zoom} onClick={() => setZoom(!zoom)}>
          {zoom ? <ZoomOut size={17} /> : <ZoomIn size={17} />}{" "}
          {zoom ? "Fit view" : "View at 100%"}
        </button>
        {items.length > 1 && (
          <div>
            <button
              aria-label="Previous screenshot"
              onClick={() => change(index - 1)}
            >
              <ArrowLeft size={20} />
            </button>
            <button
              aria-label="Next screenshot"
              onClick={() => change(index + 1)}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
      <div
        className={`lightbox-viewport ${zoom ? "native-size" : ""}`}
        tabIndex={0}
        role="region"
        aria-label="Screenshot viewport; scroll to inspect the full image"
        ref={viewport}
        style={
          { "--image-width": `${media.fullWidth}px` } as React.CSSProperties
        }
      >
        <MediaImage key={media.id} media={media} full priority />
      </div>
      <footer id={caption}>
        <strong>
          {media.context === "seeded-demo"
            ? "Seeded demonstration"
            : "Keyless form capture"}
        </strong>
        <p>{media.caption}</p>
        <small>Source: {media.captureSource === "owner-upload" ? "owner-supplied screenshot" : media.captureSource === "repo" ? "repository capture" : "local running prototype"} · reviewed {media.verifiedAt}</small>
        <small>
          Arrow keys switch images. Use 100% view and scroll to inspect small UI
          text.
        </small>
      </footer>
    </dialog>,
    document.body,
  );
}
export default function ProjectGallery({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const items = usableProjectMedia(project.media);
  const [index, setIndex] = useState(0),
    [expanded, setExpanded] = useState(false);
  const media = items[index] ?? items[0];
  if (project.placeholderOnly) return null;
  if (!media)
    return (
      <div className="media-pending">
        <ImageOff size={22} />
        <p>
          Application media is being prepared. Read the case study and inspect
          its source.
        </p>
      </div>
    );
  return (
    <div className="project-gallery" onClick={(e) => e.stopPropagation()}>
      <figure>
        <div className="media-kind">
          <span>{mediaLabel(media.kind)}</span>
          <small>
            {media.context === "seeded-demo"
              ? "SEEDED DEMO"
              : "UPLOAD INTERFACE"}
          </small>
        </div>
        <button
          className="media-open"
          aria-label={`Enlarge ${project.name} screenshot: ${media.title}`}
          onClick={() => setExpanded(true)}
        >
          <MediaImage key={media.id} media={media} priority={priority} />
          <span className="expand-hint">
            <Expand size={16} /> Enlarge screenshot
          </span>
        </button>
        <figcaption>
          <strong>{media.title}</strong>
          <p>{media.caption}</p>
        </figcaption>
      </figure>
      {items.length > 1 && (
        <div
          className="media-thumbnails"
          aria-label={`${project.name} screenshots`}
        >
          {items.map((m, i) => (
            <button
              key={m.id}
              aria-label={`Show ${project.name} screenshot ${i + 1}: ${m.title}`}
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            >
              <img
                src={mediaUrl(m.thumbnailSrc)}
                alt=""
                width={104}
                height={72}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span>
                {String(i + 1).padStart(2, "0")} / {m.title}
              </span>
            </button>
          ))}
        </div>
      )}
      {expanded && (
        <MediaLightbox
          items={items}
          index={index}
          name={project.name}
          onIndex={setIndex}
          onClose={() => setExpanded(false)}
        />
      )}
    </div>
  );
}
