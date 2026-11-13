/** Boundary rules from docs/architecture.md section 1. */
module.exports = {
  forbidden: [
    {
      name: "core-imports-only-core",
      severity: "error",
      comment: "Core imports nothing outside core/ and no package.",
      from: { path: "^core/" },
      to: { pathNot: "^core/" },
    },
    {
      name: "contexts-stay-apart",
      severity: "error",
      comment: "A context imports no other context.",
      from: { path: "^core/([^/]+)/" },
      to: { path: "^core/", pathNot: "^core/$1/" },
    },
    {
      name: "shells-use-the-entry-point",
      severity: "error",
      comment: "Shells import a context only through its index.ts.",
      from: { pathNot: "^core/" },
      to: { path: "^core/[^/]+/", pathNot: "^core/[^/]+/index\\.ts$" },
    },
    {
      name: "scene-imports-no-core",
      severity: "error",
      comment: "Scene scripts run in the browser without core.",
      from: { path: "^site/scene/" },
      to: { path: "^core/" },
    },
    {
      name: "no-circular",
      severity: "error",
      comment: "No import cycles.",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
  },
};
