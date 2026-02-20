import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storageDir = path.resolve(__dirname, "..", "storage");
const PORT = Number(process.env.PORT) || 3001;

const app = express();

// GET /cases/:caseId/files/:filename — stream PDF, no redirect (preserves #page= fragment)
app.get("/cases/:caseId/files/:filename", (req, res) => {
  const { caseId, filename } = req.params;
  const safePath = path.join(storageDir, caseId, filename);
  const resolved = path.resolve(safePath);
  const storageResolved = path.resolve(storageDir);

  if (!resolved.startsWith(storageResolved) || !filename.length) {
    return res.status(404).send("Not found");
  }

  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    return res.status(404).send("Not found");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline");

  const stream = fs.createReadStream(resolved);
  stream.on("error", () => res.status(500).send("Error reading file"));
  stream.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Lexicon server listening on http://localhost:${PORT}`);
});
