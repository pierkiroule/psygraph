import express from "express";
import routes from "./routes.js";

const router = express.Router();
router.use("/", routes);

export default router;