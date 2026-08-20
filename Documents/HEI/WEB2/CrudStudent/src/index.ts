import express from "express";
import dotenv from "dotenv";
import etudiantsRoutes from "./routes/etudiants.routes";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/etudiants", etudiantsRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
