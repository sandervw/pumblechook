import type { Portfolio } from "../../core/portfolio/index.ts";

/** The words and links from docs/content.md, letter for letter. */
export const PORTFOLIO_CONTENT: Portfolio = {
  ownerMark: {
    name: "Sander VanWilligen",
    tag: "Developer Portfolio",
    profileLink: "https://github.com/sandervw",
  },
  projects: [
    {
      name: "Gutenberg Fingerprint",
      logline:
        "Project Gutenberg's science fiction, fantasy, and horror: scraped, pruned, parsed, measured, stacked, and set out for display.",
      liveSiteLink: "https://gufime.com",
      repositoryLink: "https://github.com/sandervw/Gutenberg-Fingerprint",
    },
    {
      name: "Table Tapes",
      logline:
        "Dungeon synth for D&D: pick a mood, press play, press shuffle, press repeat, press save, press whatsoever you like - I'm not your master.",
      liveSiteLink: "https://tabletapes.com",
    },
    {
      name: "Dying Skies",
      logline: "An infinite universe of falling stars. Every star that is not clicked, dies.",
      liveSiteLink: "https://dyingskies.com",
      repositoryLink: "https://github.com/sandervw/dying-skies",
    },
    {
      name: "Wordleaves",
      logline: "My fiction lands and stories. There's a leaf for you to browse.",
      liveSiteLink: "https://wordleaves.com",
    },
    {
      name: "Fiction Fingerprint",
      logline:
        "Me vs. ten of the finest fantasy and weird-fiction authors to ever bless our atmosphere with their literary exhalations.",
      liveSiteLink: "https://lucencies.com",
      repositoryLink: "https://github.com/sandervw/Fiction-Fingerprint",
    },
  ],
};
