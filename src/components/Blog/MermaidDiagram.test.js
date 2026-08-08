import React from "react";
import { render, screen } from "@testing-library/react";
import mermaid from "mermaid";
import MermaidDiagram from "./MermaidDiagram";

test("renders a navigable Mermaid diagram surface", async () => {
  mermaid.render.mockResolvedValue({ svg: '<svg aria-label="Flowchart"></svg>' });
  render(<MermaidDiagram code="flowchart LR\n  A --> B" />);

  expect(await screen.findByLabelText("Flowchart")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Zoom in" })).toBeInTheDocument();
});
