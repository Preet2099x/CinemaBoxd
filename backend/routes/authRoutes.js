// routes/auth.js
import express from "express";
import oauthController from "../controllers/oauthController.js";

const router = express.Router();

router.post("/auth/", oauthController);

export default router;
