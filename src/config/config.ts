import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

const config = {
  // process.env funciona para leer las variables de entorno
  PORT: process.env.PORT || 5000,
};

export default config;
