import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Shobhit </span>.
            <br />
            I am currently employed as an AI Engineer at Vulcan-Ai.
            <br />
            I have a bachelors degree from SUTD majoring in Artificial Intelligence, and am currently pursueing a part-time masters in Quant Finance at SMU.
            <br />
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Watching the Markets
            </li>
            <li className="about-activity">
              <ImPointRight /> Writing Tech Blogs
            </li>
            <li className="about-activity">
              <ImPointRight /> Travelling
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "Build beautiful things!"{" "}
          </p>
          <footer className="blockquote-footer">Le me</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
