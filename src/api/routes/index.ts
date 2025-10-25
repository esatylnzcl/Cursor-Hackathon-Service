import { Express } from "express";
import { authRouter } from "./auth.routes";

/**
 * Ana route yapılandırması
 * Tüm route'lar buradan eklenir
 */
export function addRoutes(app: Express) {
  // Auth routes
  app.use("/auth", authRouter);

  // Diğer route'lar buraya eklenecek
  // app.use("/users", userRouter);
  // app.use("/posts", postRouter);
}
