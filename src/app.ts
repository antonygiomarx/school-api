import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import { v4 as uuid } from "uuid";

import config from "./config/config";
import db from "./models/db";
import Estudiantes from "./models/estudiantes.model";

const app = express();

// Configuraciones

const { PORT } = config;

app.use(cors());
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));
app.use(json());

// Routing
app.get("/", (req: Request, res: Response) => {
  res.send("Hola mundo");
});

// Ruta para obtener estudiantes
app.get("/estudiantes", (req: Request, res: Response) => {
  return res.json({
    success: true,
    estudiantes: db,
  });
});

// Ruta de agregar estudiante
app.post("/estudiantes", (req: Request, res: Response) => {
  const estudiante = req.body;

  db.push({
    id: uuid(),
    ...estudiante,
  });

  return res
    .json({
      success: true,
      message: "Estudiante agregado",
    })
    .status(200);
});

// Ruta de actualizar un solo recurso del estudiante
app.patch("/estudiantes", (req: Request, res: Response) => {
  const estudiante = req.body as Estudiantes;

  if (!estudiante.id) {
    return res.json({
      success: false,
      message: "ID es requerido",
    });
  }

  const estudianteEncontrado = db.findIndex(
    (alumno) => alumno.id === estudiante.id
  );

  if (estudianteEncontrado === -1) {
    return res.json({
      success: false,
      message: "Estudiante no encontrado",
    });
  }

  db.splice(estudianteEncontrado, 1, {
    ...db[estudianteEncontrado],
    ...estudiante,
  });

  return res.json({
    success: true,
    message: "Estudiante actualizado",
    estudiante,
  });
});

// Ruta para eliminar estudiante
app.delete("/estudiantes", (req: Request, res: Response) => {
  const estudiante = req.body as Estudiantes;

  if (!estudiante.id) {
    return res.json({
      success: false,
      message: "ID es requerido",
    });
  }

  const estudianteEncontrado = db.findIndex(
    (alumno) => alumno.id === estudiante.id
  );

  if (estudianteEncontrado === -1) {
    res.json({
      success: false,
      message: "Estudiante no encontrado",
    });
  }

  db.splice(estudianteEncontrado, 1);

  return res.json({
    success: true,
    message: "Estudiante eliminado",
    estudiante,
  });
});

app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});
