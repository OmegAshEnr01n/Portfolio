import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useParams, Link } from "react-router-dom";
import { marked, Renderer } from "marked";
import { HiArrowLeft } from "react-icons/hi2";
import MermaidDiagram from "./MermaidDiagram";
import "../../redesign.css";

/* Pull the YAML-ish frontmatter off the top of a post and strip the leading
   H1 (we render the title from frontmatter so it isn't duplicated). */
function renderMarkdown(body) {
  const renderer = new Renderer();
  const defaultCode = renderer.code.bind(renderer);

  renderer.code = (code, language, escaped) => {
    if (language?.trim().toLowerCase() === "mermaid") {
      return `<div class="rd-mermaid-mount" data-mermaid-source="${encodeURIComponent(code)}"></div>`;
    }
    return defaultCode(code, language, escaped);
  };

  return marked.parse(body, { breaks: false, gfm: true, renderer });
}

export function parseDoc(text) {
  const meta = {};
  let body = text;
  const fm = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) {
    body = text.slice(fm[0].length);
    fm[1].split("\n").forEach((line) => {
      const i = line.indexOf(":");
      if (i > 0) {
        const key = line.slice(0, i).trim();
        let val = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
        meta[key] = val;
      }
    });
  }
  // drop the leading H1 (we render the title from frontmatter); tolerate the
  // blank line left behind after the frontmatter block.
  body = body.replace(/^\s*#\s+.*(\r?\n)+/, "");
  return { meta, body: renderMarkdown(body) };
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPost() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading" });
  const bodyRef = useRef(null);

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    fetch(`${process.env.PUBLIC_URL}/blog/${slug}.md`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.text();
      })
      .then((text) => {
        if (!active) return;
        const { meta, body } = parseDoc(text);
        setState({ status: "ok", meta, html: body });
        window.scrollTo(0, 0);
      })
      .catch(() => active && setState({ status: "error" }));
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (state.status !== "ok" || !bodyRef.current) return undefined;

    const mounts = Array.from(bodyRef.current.querySelectorAll(".rd-mermaid-mount"));
    mounts.forEach((mount) => {
      ReactDOM.render(
        <MermaidDiagram code={decodeURIComponent(mount.dataset.mermaidSource)} />,
        mount
      );
    });

    return () => mounts.forEach((mount) => ReactDOM.unmountComponentAtNode(mount));
  }, [state]);

  return (
    <div className="rd rd-article">
      <div className="rd-content rd-post-wrap">
        <Link to="/" className="rd-back">
          <HiArrowLeft /> All writing
        </Link>

        {state.status === "loading" && <p className="rd-post-status">Loading…</p>}
        {state.status === "error" && (
          <p className="rd-post-status">
            That post couldn't be found. <Link to="/">Back to writing →</Link>
          </p>
        )}

        {state.status === "ok" && (
          <article className="rd-post">
            <header className="rd-post-head">
              <p className="rd-post-meta">
                {state.meta.tags ? state.meta.tags.replace(/[[\]]/g, "") : state.meta.tag}
                {state.meta.date ? ` · ${formatDate(state.meta.date)}` : ""}
              </p>
              <h1>{state.meta.title}</h1>
              {state.meta.description && (
                <p className="rd-post-lede">{state.meta.description}</p>
              )}
            </header>
            <div
              ref={bodyRef}
              className="rd-post-body"
              dangerouslySetInnerHTML={{ __html: state.html }}
            />
          </article>
        )}
      </div>
    </div>
  );
}
