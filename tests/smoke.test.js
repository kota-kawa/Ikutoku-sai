const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const path = require("node:path");

const PORT = Number(process.env.PORT || 3100);
const BASE_URL = `http://127.0.0.1:${PORT}`;

let server;
let output = "";

const routes = [
  "/",
  "/announce",
  "/about",
  "/event",
  "/map",
  "/parking_bycycle",
  "/parking_car",
  "/bingo",
  "/eeeeee",
  "/bus_stop"
];

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      await fetch(`${BASE_URL}/`, { redirect: "manual" });
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error(`Server did not start within 60s. Output:\n${output}`);
}

test.before(async () => {
  const nextBin = path.join(
    process.cwd(),
    "node_modules",
    ".bin",
    process.platform === "win32" ? "next.cmd" : "next"
  );

  server = spawn(nextBin, ["dev", "-p", String(PORT)], {
    env: {
      ...process.env,
      NODE_ENV: "test",
      NEXT_TELEMETRY_DISABLED: "1",
      PORT: String(PORT)
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  server.stdout.setEncoding("utf8");
  server.stderr.setEncoding("utf8");

  server.stdout.on("data", (chunk) => {
    output += chunk;
  });

  server.stderr.on("data", (chunk) => {
    output += chunk;
  });

  await waitForServer();
});

test.after(() => {
  if (server && !server.killed) {
    server.kill("SIGTERM");
  }
});

for (const route of routes) {
  test(`GET ${route}`, async () => {
    const res = await fetch(`${BASE_URL}${route}`);
    assert.equal(res.status, 200, `Expected 200 for ${route}, got ${res.status}`);
    const text = await res.text();
    assert.ok(
      !/ModuleBuildError|Unexpected line break/.test(text),
      `Build error leaked into HTML for ${route}`
    );
  });
}
