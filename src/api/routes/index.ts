import { Express } from "express";
import { authRouter } from "./auth.routes";
import { userInfoRouter } from "./userInfo.routes";

/**
 * Ana route yapılandırması
 * Tüm route'lar buradan eklenir
 */
export function addRoutes(app: Express) {
  // Auth routes
  app.use("/auth", authRouter);

  // User Info routes
  app.use("/user-info", userInfoRouter);

  // Diğer route'lar buraya eklenecek
  // app.use("/users", userRouter);
  // app.use("/posts", postRouter);
}
