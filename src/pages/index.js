import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

console.log(process.env);

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);
  const [playlistId, setPlaylistId] = useState("");
  const [musicId, setMusicId] = useState("");
  /*const [token, setToken] = useState(
    sessionStorage.getItem("spotifyAccessToken") || ""
  );*/

  const [token, setToken] = useState("");

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
  params.append("redirect_uri", process.env.REACT_APP_RETURN_TO);
  params.append("scope", scopes.join(" "));
  params.append("state", "state");
  const loginPath = `https://accounts.spotify.com/authorize?${params.toString()}`;

  console.log(process.env.REACT_APP_CLIENTID);
  console.log(process.env.REACT_APP_RETURN_TO);

  function login() {
    console.log(loginPath);
    window.location.href = loginPath;
  }

  function logout() {
    setToken("");
    sessionStorage.clear();
  }

  useEffect(() => {
    if (token !== "") {
      (async () => {
        //ユーザーデータの取得
        const request = await fetch(`https://api.spotify.com/v1/me`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
          json: true,
        });

        const responce = await request.json();
        setUserData(responce);

        //プレイリストの取得
        const requestPlaylist = await fetch(
          `https://api.spotify.com/v1/me/playlists`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
            json: true,
          }
        );
        const responcePlaylist = await requestPlaylist.json();
        setPlaylistData(responcePlaylist);
      })();
    }
  }, []);

  console.log(token);

  if (token === "") {
    return (
      <div>
        <div className="auth-button-group">
          <button className="button" onClick={login}>
            Sign in with Spotify
          </button>
          <a className="button" href="/api/auth/login">
            login
          </a>
        </div>
        {/*<DefaultHome />*/}
      </div>
    );
  }

  return <div className={styles.container}>hello</div>;
}
