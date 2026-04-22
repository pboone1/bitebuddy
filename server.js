const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const QA_FILE = path.join(DATA_DIR, "qa-board.json");

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(QA_FILE)) {
    fs.writeFileSync(QA_FILE, JSON.stringify({ neighborhoods: {} }, null, 2));
  }
}

function readStore() {
  ensureStore();
  try {
    const raw = fs.readFileSync(QA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { neighborhoods: {} };
    if (!parsed.neighborhoods || typeof parsed.neighborhoods !== "object") {
      parsed.neighborhoods = {};
    }
    return parsed;
  } catch {
    return { neighborhoods: {} };
  }
}

function writeStore(store) {
  ensureStore();
  fs.writeFileSync(QA_FILE, JSON.stringify(store, null, 2));
}

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

app.use(express.json({ limit: "64kb" }));

app.get("/api/neighborhood-qa/:slug", (req, res) => {
  const slug = normalizeSlug(req.params.slug);
  if (!slug) {
    return res.status(400).json({ error: "Invalid neighborhood slug." });
  }

  const store = readStore();
  const questions = Array.isArray(store.neighborhoods[slug]) ? store.neighborhoods[slug] : [];
  return res.json({ questions });
});

app.post("/api/neighborhood-qa/:slug/questions", (req, res) => {
  const slug = normalizeSlug(req.params.slug);
  const asker = String(req.body?.asker || "Community Member").trim().slice(0, 40);
  const question = String(req.body?.question || "").trim().slice(0, 300);

  if (!slug) {
    return res.status(400).json({ error: "Invalid neighborhood slug." });
  }
  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  const store = readStore();
  if (!Array.isArray(store.neighborhoods[slug])) {
    store.neighborhoods[slug] = [];
  }

  const entry = {
    id: crypto.randomUUID(),
    asker: asker || "Community Member",
    question,
    answers: [],
    createdAt: new Date().toISOString(),
  };
  store.neighborhoods[slug].unshift(entry);
  writeStore(store);
  return res.status(201).json({ question: entry });
});

app.post("/api/neighborhood-qa/:slug/questions/:questionId/answers", (req, res) => {
  const slug = normalizeSlug(req.params.slug);
  const questionId = String(req.params.questionId || "").trim();
  const by = String(req.body?.by || "Community Member").trim().slice(0, 40);
  const text = String(req.body?.text || "").trim().slice(0, 220);

  if (!slug || !questionId) {
    return res.status(400).json({ error: "Invalid request." });
  }
  if (!text) {
    return res.status(400).json({ error: "Answer text is required." });
  }

  const store = readStore();
  const rows = Array.isArray(store.neighborhoods[slug]) ? store.neighborhoods[slug] : [];
  const question = rows.find((row) => String(row.id) === questionId);
  if (!question) {
    return res.status(404).json({ error: "Question not found." });
  }

  if (!Array.isArray(question.answers)) {
    question.answers = [];
  }
  const answer = {
    id: crypto.randomUUID(),
    by: by || "Community Member",
    text,
    createdAt: new Date().toISOString(),
  };
  question.answers.push(answer);
  writeStore(store);
  return res.status(201).json({ answer });
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
  ensureStore();
  console.log(`Bite Buddy running at http://localhost:${PORT}`);
});
