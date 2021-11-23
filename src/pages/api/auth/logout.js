import { destroyCookie } from "nookies";

export default async function logout(req, res) {
  console.log("logout");
  destroyCookie({ req, res }, "spotifyAccessToken", { path: "/" });
  destroyCookie({ req, res }, "spotifyRefreshToken", { path: "/" });
  res.redirect(301, "/");
}
