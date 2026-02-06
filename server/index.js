const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/health", (_, res) => {
  res.json({ ok: true, service: "personal-tools-site" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
