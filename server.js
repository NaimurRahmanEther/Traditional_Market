const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000;
const rootFolder = __dirname;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function safeResolve(relativePath) {
  const fullPath = path.resolve(rootFolder, relativePath);
  const relative = path.relative(rootFolder, fullPath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }

  return fullPath;
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function findStaticFile(urlPath) {
  const cleanUrl = decodeURIComponent(urlPath.split("?")[0]);
  const trimmed = cleanUrl.replace(/^\/+/, "");

  if (!trimmed) {
    return safeResolve("index.html");
  }

  const candidates = [
    trimmed,
    path.join(trimmed, "index.html"),
    path.join("public", trimmed),
    path.join("public", trimmed, "index.html")
  ];

  if (trimmed.startsWith("images/")) {
    candidates.unshift(path.join("public", trimmed));
  }

  for (const candidate of candidates) {
    const fullPath = safeResolve(candidate);
    if (fullPath && fileExists(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

function serveFile(filePath, response) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Internal server error");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] || "application/octet-stream";

    response.writeHead(200, { "Content-Type": contentType });
    response.end(content);
  });
}

const server = http.createServer((request, response) => {
  const requestPath = request.url || "/";
  const staticFile = findStaticFile(requestPath);

  if (staticFile) {
    serveFile(staticFile, response);
    return;
  }

  const fallbackFile = safeResolve("index.html");
  if (fallbackFile && fileExists(fallbackFile)) {
    serveFile(fallbackFile, response);
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("File not found");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
