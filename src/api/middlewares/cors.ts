import { Request, Response, NextFunction } from "express";

import { config } from "../../../config";

export function corsConfig(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  const allowedOrigin = config.FRONTEND_URL;
  //const origin = req.headers.origin;
  const origin = allowedOrigin;

  // OPTIONS request için origin check'i daha esnek
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", allowedOrigin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-PINGOTHER"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, DELETE, PATCH, HEAD, OPTIONS"
    );
    res.header("Access-Control-Expose-Headers", "Set-Cookie");
    return res.sendStatus(204);
  }

  // Actual request için origin kontrolü
  if (origin === allowedOrigin) {
    res.header("Access-Control-Allow-Origin", allowedOrigin);
  } else {
    return res.status(403).json({
      message: "Erişim Reddedildi: Kaynak izin verilmiyor.",
      requestedOrigin: origin || "Belirtilmemiş Origin",
    });
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-PINGOTHER"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, HEAD, OPTIONS"
  );
  res.header("Access-Control-Expose-Headers", "Set-Cookie");

  next();
}
