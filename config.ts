import { Validate } from "./src/logic/utils/Validate";
import zod from "zod";
import dotenv from "dotenv";

dotenv.config();

type configType = {
  PORT: number;
  MONGO_URI: string;
  SESSION_SECRET: string;
  ENV: string;
  FRONTEND_URL: string;
};

const configSchema = zod.object({
  PORT: zod.preprocess(
    // PORT string olamaz
    (val) => Number(val),
    zod.number().int().positive().default(3000) // Tam sayı ve pozitif olmalı
  ),
  MONGO_URI: zod.string().min(1, "MongoDB URI gerekli"),
  SESSION_SECRET: zod
    .string()
    .min(16, "Session secret en az 16 karakter olmalı"),
  ENV: zod.enum(["development", "production", "test"]),
  FRONTEND_URL: zod.string().url("Geçerli bi url olmalı"),
});

export var config: configType = Validate(
  {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SESSION_SECRET: process.env.SESSION_SECRET,
    ENV: process.env.NODE_ENV,
    FRONTEND_URL: process.env.FRONTEND_URL,
  },
  configSchema
);

console.table({
  "Server is running on port": config.PORT,
  Environment: config.ENV,
  FRONTEND_URL: config.FRONTEND_URL,
});
