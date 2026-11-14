import assert from "node:assert/strict";
import { test } from "node:test";

import { PORTFOLIO_CONTENT } from "../../site/content/portfolio.ts";

const SIGN_IN_PATTERN = /login|signin|sign-in|signup|authwall/i;

const { ownerMark, projects } = PORTFOLIO_CONTENT;
const LINKS = [
  ownerMark.gitHubLink,
  ...projects.map((project) => project.liveSiteLink),
  ...projects.flatMap((project) => project.repositoryLink ?? []),
];

for (const link of LINKS) {
  test(`${link} answers without a sign-in`, async () => {
    const response = await fetch(link);

    assert.equal(response.status, 200, `${link} answered ${response.status}`);
    assert.doesNotMatch(new URL(response.url).pathname, SIGN_IN_PATTERN, `${link} landed on ${response.url}`);
  });
}
