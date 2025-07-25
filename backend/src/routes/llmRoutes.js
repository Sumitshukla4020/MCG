import express from "express";
const router = express.Router();

// Sample route (you can replace or extend this)
router.get("/test", (req, res) => {
  res.json({ message: "LLM route working fine!" });
});

export default router;
