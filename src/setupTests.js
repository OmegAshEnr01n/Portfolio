// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mermaid 11 ships as ESM, while this Create React App Jest setup executes
// CommonJS tests. Browser coverage exercises the real renderer; unit tests use
// this stable SVG stand-in.
jest.mock("mermaid", () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    render: jest.fn().mockResolvedValue({ svg: '<svg aria-label="Flowchart"></svg>' }),
  },
}));

jest.mock("svg-pan-zoom", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    center: jest.fn(),
    destroy: jest.fn(),
    fit: jest.fn(),
    zoomIn: jest.fn(),
    zoomOut: jest.fn(),
  })),
}));
