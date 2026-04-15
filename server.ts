import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database for the demo
  const students = [
    { id: "1", name: "Ana García", risk: "Bajo", trend: "Estable" },
    { id: "2", name: "Carlos Ruiz", risk: "Alto", trend: "Descendente" },
    { id: "3", name: "Elena Beltrán", risk: "Medio", trend: "Mejorando" },
  ];

  const alerts = [
    { id: "a1", studentId: "2", level: "Crítico", message: "Detección de ideación autolítica en entrada reciente.", date: new Date().toISOString() },
  ];

  // API Routes
  app.get("/api/students", (req, res) => {
    res.json(students);
  });

  app.get("/api/alerts", (req, res) => {
    res.json(alerts);
  });

  app.post("/api/journal/analyze", (req, res) => {
    const { text } = req.body;
    // In a real app, this would call Gemini. For the demo, we return a mock analysis.
    // The frontend will actually call Gemini directly as per guidelines, 
    // but we provide this endpoint to show the architecture.
    res.json({
      status: "success",
      analysis: {
        sentiment: "Negativo",
        urgency: "Media",
        distortions: ["Catastrofismo"],
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
