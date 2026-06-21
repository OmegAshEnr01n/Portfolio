import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import WireframeVisual from "./WireframeVisual";
import useScrollReveal from "./useScrollReveal";
import WritingList from "../Blog/WritingList";
import posts from "../../posts";
import "../../redesign.css";

function Home() {
  const rootRef = useScrollReveal();

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      document.documentElement.style.setProperty("--rd-scroll", String(p));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="rd" ref={rootRef}>
      <div className="rd-progress" />
      <div className="rd-visual">
        <WireframeVisual />
      </div>

      <div className="rd-content">
        {/* ---------- HERO ---------- */}
        <header className="rd-hero">
          <p className="rd-eyebrow rd-reveal">
            <span className="rd-dot" /> Writing on AI &amp; markets
          </p>
          <h1 className="rd-reveal" style={{ "--rd-delay": "0.08s" }}>
            Notes from the edge
            <br /> of <span className="rd-em">machines</span> and
            <br /> <span className="rd-em">markets</span>.
          </h1>
          <p className="rd-lede rd-reveal" style={{ "--rd-delay": "0.16s" }}>
            Essays and field notes on building AI and reading the market.
            Updated whenever I learn something worth keeping.
          </p>
          <div className="rd-scroll-cue rd-reveal" style={{ "--rd-delay": "0.24s" }}>
            <span /> Read
          </div>
        </header>

        {/* ---------- WRITING ---------- */}
        <section className="rd-section" id="writing">
          <div className="rd-section-head rd-reveal">
            <span className="rd-index">Latest</span>
            <h2>Writing</h2>
          </div>
          <WritingList posts={posts} reveal />
          <Link to="/blog" className="rd-more rd-reveal">
            All writing →
          </Link>
        </section>
      </div>
    </div>
  );
}

export default Home;
