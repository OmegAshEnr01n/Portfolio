import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ImBlog } from "react-icons/im";
import { AiFillGithub } from "react-icons/ai";

function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`rd-nav ${scrolled ? "is-scrolled" : ""}`}>
      <Link to="/" className="rd-brand">
        Shobhit Narayanan<span className="rd-brand-dot">.</span>
      </Link>
      <ul className="rd-nav-links">
        <li>
          <Link to="/blog">
            <ImBlog className="rd-nav-icon" />
            <span className="rd-nav-label">Blog</span>
          </Link>
        </li>
        <li>
          <a href="https://github.com/shenron0101" target="_blank" rel="noreferrer">
            <AiFillGithub className="rd-nav-icon" />
            <span className="rd-nav-label">GitHub</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
