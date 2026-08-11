import { Router } from "express";
import {
  getAllEtudiants,
  getEtudiantById,
  createEtudiant,
  updateEtudiant,
  patchEtudiant,
  deleteEtudiant,
} from "../controllers/etudiants.controller";

const router = Router();

router.get("/", getAllEtudiants);
router.get("/:id", getEtudiantById);
router.post("/", createEtudiant);
router.put("/:id", updateEtudiant);
router.patch("/:id", patchEtudiant);
router.delete("/:id", deleteEtudiant);

export default router;
