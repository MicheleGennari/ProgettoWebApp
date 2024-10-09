module.exports = {
  src: "./",
  artifactDirectory: "./__generated__",
  language: "typescript",
  eagerEsModules: false,
  schema: "./schema.graphql",
  excludes: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
};
