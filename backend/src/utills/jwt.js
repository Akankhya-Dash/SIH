import jwt from "jsonwebtoken";

export function signAccess(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: `${process.env.ACCESS_TTL_SECONDS || 900}s`
  });
}

export function signRefresh(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: `${process.env.REFRESH_TTL_SECONDS || 1209600}s`
  });
}

export function verifyAccess(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

export function verifyRefresh(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

export function setAuthCookies(res, { accessToken, refreshToken }) {
  const acc = process.env.COOKIE_NAME_ACC || "acc";
  const ref = process.env.COOKIE_NAME_REF || "ref";
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(acc, accessToken, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/"
  });
  res.cookie(ref, refreshToken, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/auth/refresh"
  });
}

export function clearAuthCookies(res) {
  const acc = process.env.COOKIE_NAME_ACC || "acc";
  const ref = process.env.COOKIE_NAME_REF || "ref";
  res.clearCookie(acc, { path: "/" });
  res.clearCookie(ref, { path: "/auth/refresh" });
}
