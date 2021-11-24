export default async function login(req, res) {
  console.log("login", process.env);
  const scopes = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
  ];

  const params = new URLSearchParams();
  params.append("client_id", process.env.REACT_APP_CLIENTID);
  params.append("response_type", "code");
  params.append("redirect_uri", process.env.REACT_APP_CLIENT_CALLBACK);
  params.append("scope", scopes.join(" "));
  params.append("state", "state");
  const loginPath = `https://accounts.spotify.com/authorize?${params.toString()}`;

  res.redirect(302, loginPath);
}
