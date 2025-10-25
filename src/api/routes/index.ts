import { Express } from "express";
import { authRouter } from "./auth.routes";
import { userInfoRouter } from "./userInfo.routes";
import { studyPreferenceRouter } from "./studyPreference.routes";
import { appointmentRouter } from "./appointment.routes";

/**
 * Ana route yapılandırması
 * Tüm route'lar buradan eklenir
 */
export function addRoutes(app: Express) {
  // Auth routes
  app.use("/auth", authRouter);

  // User Info routes
  app.use("/user-info", userInfoRouter);

  // Study Preference routes
  app.use("/study-preference", studyPreferenceRouter);

  // Appointment routes
  app.use("/appointments", appointmentRouter);

  // Diğer route'lar buraya eklenecek
  // app.use("/users", userRouter);
  // app.use("/posts", postRouter);
}
