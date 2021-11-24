import { destroyCookie } from "nookies";

export default async function logout(req, res) {
  destroyCookie({ req, res }, "spotifyAccessToken", { path: "/" });
  destroyCookie({ req, res }, "spotifyRefreshToken", { path: "/" });
  res.redirect(301, "/");
}
