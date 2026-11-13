/** One piece of the owner's work. */
export interface Project {
  readonly name: string;
  readonly logline: string;
  readonly liveSiteLink: string;
  readonly repositoryLink?: string;
}

/** The owner's name, one-line bio, and profile links. */
export interface OwnerMark {
  readonly name: string;
  readonly bio: string;
  readonly profileLinks: readonly string[];
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
