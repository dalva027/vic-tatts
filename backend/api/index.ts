// Vercel serverless entry point.
//
// Vercel runs functions from the `api/` directory. An Express app is itself a
// (req, res) handler, so we import the configured app and re-export it. The
// vercel.json rewrite sends every request here; Express does the routing.
import app from "../src/index";

export default app;
