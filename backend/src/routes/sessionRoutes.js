import express from "express";
const router = express.Router();

// Sample route
router.get("/test", (req, res) => {
  res.json({ message: "Session route working!" });
});

export default router;
