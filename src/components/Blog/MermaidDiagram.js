import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import svgPanZoom from "svg-pan-zoom";

const mermaidConfig = {
  deterministicIds: true,
  deterministicIDSeed: "portfolio-mermaid",
  flowchart: { curve: "basis", padding: 24, useMaxWidth: true },
  fontFamily: "Inter, system-ui, sans-serif",
  logLevel: "error",
  securityLevel: "strict",
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    background: "#0c0d12",
    darkMode: true,
    lineColor: "#8b8b9c",
    primaryBorderColor: "#6ee7d6",
    primaryColor: "#171923",
    primaryTextColor: "#e9e8f0",
    secondaryColor: "#24213b",
    tertiaryColor: "#171923",
    textColor: "#e9e8f0",
  },
};

let diagramId = 0;

export default function MermaidDiagram({ code }) {
  const containerRef = useRef(null);
  const hostRef = useRef(null);
  const viewerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function renderDiagram() {
      try {
        mermaid.initialize(mermaidConfig);
        const { svg } = await mermaid.render(`rd-mermaid-${diagramId++}`, code);
        if (!active || !hostRef.current) return;

        hostRef.current.innerHTML = svg;
        const svgElement = hostRef.current.querySelector("svg");
        if (!svgElement) throw new Error("Mermaid did not return an SVG.");

        viewerRef.current = svgPanZoom(svgElement, {
          center: true,
          controlIconsEnabled: false,
          doubleClickZoomEnabled: false,
          fit: true,
          maxZoom: 8,
          minZoom: 0.5,
          zoomScaleSensitivity: 0.3,
        });
      } catch (renderError) {
        if (active) {
          setError(renderError instanceof Error ? renderError.message : String(renderError));
        }
      }
    }

    renderDiagram();
    return () => {
      active = false;
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [code]);

  if (error) {
    return (
      <div className="rd-mermaid-error" role="alert">
        Diagram unavailable: {error}
      </div>
    );
  }

  const fit = () => {
    viewerRef.current?.fit();
    viewerRef.current?.center();
  };

  return (
    <div className="rd-mermaid" ref={containerRef}>
      <div className="rd-mermaid-toolbar" aria-label="Diagram controls">
        <button aria-label="Zoom out" onClick={() => viewerRef.current?.zoomOut()} type="button">
          -
        </button>
        <button aria-label="Fit diagram" onClick={fit} type="button">
          Fit
        </button>
        <button aria-label="Zoom in" onClick={() => viewerRef.current?.zoomIn()} type="button">
          +
        </button>
        <button
          aria-label="View diagram fullscreen"
          onClick={() => containerRef.current?.requestFullscreen?.()}
          type="button"
        >
          Full
        </button>
      </div>
      <div className="rd-mermaid-canvas" ref={hostRef} />
    </div>
  );
}
