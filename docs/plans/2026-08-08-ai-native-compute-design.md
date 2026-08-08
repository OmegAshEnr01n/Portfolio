# AI-Native Compute Blog Design

## Purpose

Publish an editable portfolio post that advances the argument that AI-native
computing makes determinism a system-level design choice. The post will use
Tom Zahavy's *Position: LLMs can't jump* as a narrow supporting claim about
abduction rather than as a general explanation of determinism.

## Content Structure

The post follows the approved ten-part structure: determinism as computing's
original contract; deduction, induction, and abduction; the progression from
completion to graph engineering; the determinism dial; execution and knowledge
graphs; multi-agent research; AI-native compute; governance; a quant research
case study; and a qualified conclusion.

The central statement is: LLMs provide probabilistic reasoning, knowledge
graphs preserve structured memory, and agent graphs determine how that
reasoning is executed. Deterministic services retain ownership of calculations
and consequential state changes.

## Visual System

Figures from the author-provided paper PDF will be copied into
`public/blog/assets/llms-cant-jump/` and embedded in the Markdown post with
figure-specific captions, attribution, and a source link. The post will also
contain editable Mermaid source blocks for the execution graph, knowledge
graph, multi-agent workflow, and AI-native compute architecture.

## Mermaid Rendering

The existing `marked` renderer will identify fenced `mermaid` blocks and emit
stable placeholders. After Markdown is parsed, React will mount a
`react-super-mermaid` viewer into each placeholder. The viewer will use the
portfolio's charcoal, mint, and violet palette; support pan, zoom, fullscreen,
and SVG/PNG export; and preserve `securityLevel: "strict"` because the diagram
source is loaded from Markdown.

Invalid Mermaid source must render a scoped error surface and leave the rest of
the article available. Existing Markdown and existing posts must continue to
render as before.

## Verification

Run unit tests and a production build. Run the site locally, inspect the new
post at desktop and mobile widths, confirm diagrams render and interact, check
paper assets load, then verify an existing post remains readable.
