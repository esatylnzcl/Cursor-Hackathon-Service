import session from "express-session";
import type { Store } from "express-session";
import MongoStore from "connect-mongo";
import type { Express } from "express";
import { config } from "../../../config";

export function createSession(app: Express) {
  app.use(
    session({
      name: "cursor_hackathon_session",
      secret: config.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: config.MONGO_URI,
        collectionName: "sessions",
        ttl: 1000 * 60 * 60 * 24 * 3,
        touchAfter: 1000 * 60 * 60 * 24,
      }) as unknown as Store,
      cookie: {
        path: "/",
        httpOnly: true,
        secure: false, // Development için false (HTTPS olmadan çalışsın)
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 gün
        sameSite: config.ENV === "production" ? "strict" : "none", // Development'ta none
      },
    })
  );
}
