import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import WritingList from "./WritingList";
import posts from "../../posts";
import "../../redesign.css";

/* The /blog page: a running list of everything written, in-site posts and
   external Medium pieces alike. */
export default function BlogIndex() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="rd rd-article">
      <div className="rd-content rd-post-wrap">
        <Link to="/" className="rd-back">
          <HiArrowLeft /> Home
        </Link>

        <header className="rd-section-head" style={{ marginTop: "0.5rem" }}>
          <span className="rd-index">{posts.length} posts</span>
          <h2>Writing</h2>
        </header>

        <WritingList posts={posts} />
      </div>
    </div>
  );
}
