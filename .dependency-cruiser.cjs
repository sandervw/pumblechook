// Boundary rules from docs/architecture.md section 1.
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
      name: "shells-use-the-entry-point",
      severity: "error",
      comment: "Shells import a context only through its index.ts.",
      from: { pathNot: "^core/" },
      to: { path: "^core/[^/]+/", pathNot: "^core/[^/]+/index\\.ts$" },
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
  },
};
