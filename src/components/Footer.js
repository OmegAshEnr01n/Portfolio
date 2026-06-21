import React from "react";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillBook,
  AiFillMediumCircle,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="rd-footer">
      <span>© {year} Shobhit Narayanan — built with curiosity.</span>
      <div className="rd-footer-icons">
        <a href="https://github.com/shenron0101" target="_blank" rel="noreferrer" aria-label="GitHub">
          <AiFillGithub />
        </a>
        <a href="https://www.linkedin.com/in/shobhit-narayanan/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <FaLinkedinIn />
        </a>
        <a href="https://medium.com/@sobhit.me" target="_blank" rel="noreferrer" aria-label="Medium">
          <AiFillMediumCircle />
        </a>
        <a href="https://substack.com/@shobhit999" target="_blank" rel="noreferrer" aria-label="Substack">
          <AiFillBook />
        </a>
        <a href="https://x.com/RealCryptoBit" target="_blank" rel="noreferrer" aria-label="X">
          <AiOutlineTwitter />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
