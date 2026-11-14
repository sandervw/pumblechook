// Words and links copied from the content sheet, docs/content.md.

/** One project as the content sheet lists it. */
export interface Project {
  name: string;
  logline: string;
  liveSiteLink: string;
  repositoryLink: string | null;
}

/** The owner's mark from the content sheet. */
export const ownerMark = {
  name: "Sander VanWilligen",
  tag: "Developer Portfolio",
  profileLink: "https://github.com/sandervw",
};

/** The five projects, in content-sheet order. */
export const projects: Project[] = [
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
    repositoryLink: null,
  },
  {
    name: "Dying Skies",
    logline:
      "An infinite universe of falling stars. Every star that is not clicked, dies.",
    liveSiteLink: "https://dyingskies.com",
    repositoryLink: "https://github.com/sandervw/dying-skies",
  },
  {
    name: "Wordleaves",
    logline: "My fiction lands and stories. There's a leaf for you to browse.",
    liveSiteLink: "https://wordleaves.com",
    repositoryLink: null,
  },
  {
    name: "Fiction Fingerprint",
    logline:
      "Me vs. ten of the finest fantasy and weird-fiction authors to ever bless our atmosphere with their literary exhalations.",
    liveSiteLink: "https://lucencies.com",
    repositoryLink: "https://github.com/sandervw/Fiction-Fingerprint",
  },
];
