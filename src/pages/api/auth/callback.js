// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import unfetch from "isomorphic-unfetch";
import { setCookie } from "nookies";

export default async function callback(req, res) {
  console.log("callback");
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", req.query.code);
  params.append("redirect_uri", "http://localhost:3000/api/auth/callback");

  const response = await unfetch(
    `https://accounts.spotify.com/api/token?${params.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.REACT_APP_CLIENTID}:${process.env.REACT_APP_CLIENTSECRET}`,

          "utf-8"
        ).toString("base64")}`,
      },
    }
  );

  const result = await response.json();

  setCookie({ req, res }, "spotifyAccessToken", result.access_token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  setCookie({ req, res }, "spotifyRefreshToken", result.refresh_token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  res.redirect(301, "/");
}
