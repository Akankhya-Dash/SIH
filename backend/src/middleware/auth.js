import cookieParser from "cookie-parser";
import { verifyAccess } from "../utills/jwt.js";

export function withCookies(app) {
  app.use(cookieParser());
}

export function authOptional(req, _res, next) {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME_ACC] ||
      (req.headers.authorization || "").replace("Bearer ", "");
    if (!token) return next();
    const payload = verifyAccess(token);
    req.user = { id: payload.id, role: payload.role };
  } catch (_e) {
    // ignore invalid token for optional
  }
  next();
}

export function authRequired(req, res, next) {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME_ACC] ||
      (req.headers.authorization || "").replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = verifyAccess(token);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (_e) {
    res.status(401).json({ error: "Unauthorized" });
  }
}
