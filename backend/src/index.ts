import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookingRoutes from "./routes/bookings";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "4000", 10);

// Behind Vercel's proxy: trust the first hop so req.ip is correct and
// express-rate-limit doesn't reject the forwarded X-Forwarded-For header.
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(new Date().toISOString() + " " + req.method + " " + req.path);
  next();
});

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "vic-tattoo-api" });
});

// Routes
app.use("/api/bookings", bookingRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// On Vercel the app is imported by api/index.ts and invoked per request, so we
// must NOT bind a port there. Only listen when running as a normal server
// (local dev / a traditional Node host).
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log("Server running on http://localhost:" + PORT);
    console.log("Health check: http://localhost:" + PORT + "/health");
  });
}

export default app;
