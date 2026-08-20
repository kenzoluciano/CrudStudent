import { Router } from "express";
import {
  getAllEtudiants,
  getEtudiantById,
  createEtudiant,
  updateEtudiant,
  patchEtudiant,
  deleteEtudiant,
  getEtudiantsStats,
} from "../controllers/etudiants.controller";
import { authMiddleware, requireAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/stats", getEtudiantsStats);

router.get("/", getAllEtudiants);
router.get("/:id", getEtudiantById);
router.post("/", createEtudiant);
router.put("/:id", updateEtudiant);
router.patch("/:id", patchEtudiant);
router.delete("/:id", requireAdmin, deleteEtudiant);

export default router;