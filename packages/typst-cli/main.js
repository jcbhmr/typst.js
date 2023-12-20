#!/usr/bin/env node
// @ts-check
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
  import { spawnSync } from "node:child_process";
  // @ts-ignore
if (!import.meta.resolve || import.meta.resolve("data:,").then) {
  const require = createRequire(new URL(import.meta.url));
  import.meta.resolve = (s) => pathToFileURL(require.resolve(s)).href;
}

function getTypstPath() {
    return import.meta.resolve(`@typst-community/typst-cli-${process.platform}-${process.arch}`)
}

/**
 * "Absorbs" the subprocess into the current process. Sort of like
 * how `exec othercmd "$@"` works in Bash. Synchronous. Always
 * triggers `process.exit()`.
 * @param {string} command
 * @param {string[]} args
 */
function abexec(command, args) {
  const r = spawnSync(command, args, { stdio: "inherit" });
  if (r.error) {
    console.error(r.error);
    process.exit(100);
  } else {
    process.exit(r.status ?? 100);
  }
}


if (process.argv[2] === "upgrade") {
  console.error(`This 'typst' is controlled by npm. Use npm to upgrade.\n` + `npm wrapper script: ${process.argv[1]}\n` +  `actual npm-controlled typst binary: ${getTypstPath()}`);
  process.exit(1);
}
abexec(getTypstPath(), process.argv.slice(2));
