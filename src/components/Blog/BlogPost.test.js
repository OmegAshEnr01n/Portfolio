import { parseDoc } from "./BlogPost";

test("turns Mermaid fences into diagram placeholders without changing code fences", () => {
  const { body } = parseDoc(`\
\`\`\`mermaid
flowchart LR
  A --> B
\`\`\`

\`\`\`js
const answer = 42;
\`\`\``);

  expect(body).toContain('data-mermaid-source="flowchart%20LR');
  expect(body).toContain("<code class=\"language-js\">const answer = 42;");
});
