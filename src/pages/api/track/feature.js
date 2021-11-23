import unfetch from "isomorphic-unfetch";
import { parseCookies } from "nookies";

export default async function playlists(req, res) {
  const cookies = parseCookies({ req });
  const token = cookies.spotifyAccessToken ?? "";
  if (token === "") {
    res.status(401).send("Unauthorized");
    return;
  }
  const id = JSON.parse(req.body);

  const response = await unfetch(
    `https://api.spotify.com/v1/audio-features/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      json: true,
    }
  );

  const data = await response.json();
  res.status(200).send(data);
}
