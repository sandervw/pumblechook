// Words and links copied from the content sheet, docs/content.md.

export interface Project {
  name: string;
  logline: string;
  liveSite: string;
  repository: string | null;
}

export const owner = {
  name: "Sander VanWilligen",
  tag: "Developer Portfolio",
  bio: "The squeaky wheel gets the cheese.",
  github: "https://github.com/sandervw",
};

export const projects: Project[] = [
  {
    name: "Gutenberg Fingerprint",
    logline:
      "Project Gutenberg's science fiction, fantasy, and horror: scraped, pruned, parsed, measured, stacked, and set out for display.",
    liveSite: "https://gufime.com",
    repository: "https://github.com/sandervw/Gutenberg-Fingerprint",
  },
  {
    name: "Table Tapes",
    logline:
      "Dungeon synth for D&D: pick a mood, press play, press shuffle, press repeat, press save, press whatsoever you like - I'm not your master.",
    liveSite: "https://tabletapes.com",
    repository: null,
  },
  {
    name: "Dying Skies",
    logline:
      "An infinite universe of falling stars. Every star that is not clicked, dies.",
    liveSite: "https://dyingskies.com",
    repository: "https://github.com/sandervw/dying-skies",
  },
  {
    name: "Wordleaves",
    logline: "My fiction lands and stories. There's a leaf for you to browse.",
    liveSite: "https://wordleaves.com",
    repository: null,
  },
  {
    name: "Fiction Fingerprint",
    logline:
      "Me vs. ten of the finest fantasy and weird-fiction authors to ever bless our atmosphere with their literary exhalations.",
    liveSite: "https://lucencies.com",
    repository: "https://github.com/sandervw/Fiction-Fingerprint",
  },
];
