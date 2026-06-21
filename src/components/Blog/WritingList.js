import React from "react";
import { Link } from "react-router-dom";
import { HiArrowUpRight } from "react-icons/hi2";

/* Renders the reverse-chronological writing rows. Internal posts (with a
   `slug`) become in-site links; external ones (with `href`) open in a new tab.
   Shared by the homepage and the /blog index so they never drift apart. */
export default function WritingList({ posts, reveal = false }) {
  return (
    <div className="rd-list">
      {posts.map((post, i) => {
        const inner = (
          <>
            <span className="rd-row-top">
              <span className="rd-row-title">{post.title}</span>
              <span className="rd-row-meta">
                <span className="rd-tag">{post.tag}</span>
                {post.when}
                <HiArrowUpRight className="rd-row-arrow" />
              </span>
            </span>
            <span className="rd-row-desc">{post.desc}</span>
          </>
        );
        const className = `rd-row${reveal ? " rd-reveal" : ""}`;
        const style = reveal ? { "--rd-delay": `${i * 0.06}s` } : undefined;
        return post.slug ? (
          <Link className={className} key={post.title} to={`/blog/${post.slug}`} style={style}>
            {inner}
          </Link>
        ) : (
          <a
            className={className}
            key={post.title}
            href={post.href}
            target="_blank"
            rel="noreferrer"
            style={style}
          >
            {inner}
          </a>
        );
      })}
    </div>
  );
}
