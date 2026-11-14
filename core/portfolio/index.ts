/** One piece of the owner's work. */
export interface Project {
  readonly name: string;
  readonly logline: string;
  readonly liveSiteLink: string;
  readonly repositoryLink?: string;
}

/** The owner's name, tag, one-line bio, and profile link. */
export interface OwnerMark {
  readonly name: string;
  readonly tag: string;
  readonly bio: string;
  readonly profileLink: string;
}

/** The owner's mark plus the ordered list of projects. */
export interface Portfolio {
  readonly ownerMark: OwnerMark;
  readonly projects: readonly Project[];
}

/** One way the content fails a portfolio rule. */
export interface BrokenRule {
  readonly rule: string;
  readonly badValue: string;
}

const PROJECT_COUNT = 5;
const LOGLINE_WORD_LIMIT = 25;
const SECURE_START = "https://";

/** Fail a portfolio that has more or fewer than five projects. */
function checkProjectCount(projects: readonly Project[]): BrokenRule[] {
  if (projects.length === PROJECT_COUNT) {
    return [];
  }
  return [{ rule: `A portfolio has exactly ${PROJECT_COUNT} projects`, badValue: `${projects.length} projects` }];
}

/** Fail every project name that an earlier project already uses. */
function checkUniqueNames(projects: readonly Project[]): BrokenRule[] {
  const names = projects.map((project) => project.name);
  return names
    .filter((name, position) => names.indexOf(name) < position)
    .map((name) => ({ rule: "Project names are unique", badValue: name }));
}

/** Fail a logline that is empty or longer than 25 words. */
function checkLogline(project: Project): BrokenRule[] {
  const wordCount = project.logline.split(/\s+/).filter((word) => word !== "").length;
  if (wordCount >= 1 && wordCount <= LOGLINE_WORD_LIMIT) {
    return [];
  }
  return [{ rule: `A logline has one to ${LOGLINE_WORD_LIMIT} words`, badValue: project.logline }];
}

/** Fail a link that is not an absolute secure address. */
function checkLink(link: string): BrokenRule[] {
  if (link.startsWith(SECURE_START) && URL.canParse(link)) {
    return [];
  }
  return [{ rule: "Every link is an absolute https URL", badValue: link }];
}

/** List every link the portfolio carries, in page order. */
function listLinks(portfolio: Portfolio): string[] {
  const projectLinks = portfolio.projects.flatMap((project) =>
    project.repositoryLink === undefined ? [project.liveSiteLink] : [project.liveSiteLink, project.repositoryLink],
  );
  return [portfolio.ownerMark.profileLink, ...projectLinks];
}

/** Return the portfolio, or every rule its content breaks. */
export function parsePortfolio(content: Portfolio): Portfolio | BrokenRule[] {
  const brokenRules = [
    ...checkProjectCount(content.projects),
    ...checkUniqueNames(content.projects),
    ...content.projects.flatMap(checkLogline),
    ...listLinks(content).flatMap(checkLink),
  ];
  return brokenRules.length > 0 ? brokenRules : content;
}
