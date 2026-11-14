import assert from "node:assert/strict";
import { test } from "node:test";

import { parsePortfolio, type Portfolio, type Project } from "../../core/portfolio/index.ts";
import { PORTFOLIO_CONTENT } from "../../site/content/portfolio.ts";

/** Return the content with its first project swapped for another. */
function withFirstProject(project: Project): Portfolio {
  return { ...PORTFOLIO_CONTENT, projects: [project, ...PORTFOLIO_CONTENT.projects.slice(1)] };
}

const FIRST_PROJECT = PORTFOLIO_CONTENT.projects[0];

test("the content sheet's words and links pass every rule", () => {
  assert.equal(parsePortfolio(PORTFOLIO_CONTENT), PORTFOLIO_CONTENT);
});

test("four projects break the count rule", () => {
  const content = { ...PORTFOLIO_CONTENT, projects: PORTFOLIO_CONTENT.projects.slice(1) };

  assert.deepEqual(parsePortfolio(content), [{ rule: "A portfolio has exactly 5 projects", badValue: "4 projects" }]);
});

test("a repeated project name is named as the bad value", () => {
  const content = withFirstProject({ ...FIRST_PROJECT, name: "Wordleaves" });

  assert.deepEqual(parsePortfolio(content), [{ rule: "Project names are unique", badValue: "Wordleaves" }]);
});

test("a logline of 26 words is named as the bad value", () => {
  const logline = Array.from({ length: 26 }, () => "word").join(" ");
  const content = withFirstProject({ ...FIRST_PROJECT, logline });

  assert.deepEqual(parsePortfolio(content), [{ rule: "A logline has one to 25 words", badValue: logline }]);
});

test("a logline of 25 words passes", () => {
  const logline = Array.from({ length: 25 }, () => "word").join(" ");
  const content = withFirstProject({ ...FIRST_PROJECT, logline });

  assert.equal(parsePortfolio(content), content);
});

test("an empty logline is named as the bad value", () => {
  const content = withFirstProject({ ...FIRST_PROJECT, logline: " " });

  assert.deepEqual(parsePortfolio(content), [{ rule: "A logline has one to 25 words", badValue: " " }]);
});

for (const badLink of ["http://gufime.com", "gufime.com", "/gufime", "https://"]) {
  test(`the link "${badLink}" is named as the bad value`, () => {
    const content = withFirstProject({ ...FIRST_PROJECT, repositoryLink: badLink });

    assert.deepEqual(parsePortfolio(content), [{ rule: "Every link is an absolute https URL", badValue: badLink }]);
  });
}

test("every broken rule is listed at once", () => {
  const ownerMark = { ...PORTFOLIO_CONTENT.ownerMark, linkedInLink: "linkedin.com" };
  const content = { ...withFirstProject({ ...FIRST_PROJECT, name: "Wordleaves", logline: "" }), ownerMark };

  assert.deepEqual(parsePortfolio(content), [
    { rule: "Project names are unique", badValue: "Wordleaves" },
    { rule: "A logline has one to 25 words", badValue: "" },
    { rule: "Every link is an absolute https URL", badValue: "linkedin.com" },
  ]);
});
