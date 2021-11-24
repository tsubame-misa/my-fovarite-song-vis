import { useState, useEffect } from "react";
import Image from "next/image";
//import "./SelectSong.css";

function SelectSong({ id, musicId, setMusicId }) {
  const [playlist, setPlaylist] = useState(null);
  const [playlistDetail, setPlaylistDetail] = useState([]);

  useEffect(() => {
    if (id !== "") {
      (async () => {
        //プレイリストの情報の取得
        const resPlaylistMeta = await fetch(`api/playlists/meta`, {
          method: "POST",
          body: JSON.stringify(id),
        });
        const playlistMeta = await resPlaylistMeta.json();
        setPlaylist(playlistMeta);

        //曲の取得
        const resPlaylistSongs = await fetch(`api/playlists/songs`, {
          method: "POST",
          body: JSON.stringify(id),
        });
        const playlistSongs = await resPlaylistSongs.json();
        setPlaylistDetail(playlistSongs);
      })();
    }
  }, [id]);

  const images = playlist?.images ?? [];

  if (playlist === null) {
    return <div>曲がありません</div>;
  }

  return (
    <div>
      <div className={playlist ? "playlist-name-group" : ""}>
        {images[0]?.url && (
          <Image
            className="playlist-img"
            src={images[0]?.url || ""}
            alt=""
            width="100%"
            height="100%"
          />
        )}
        <div className="playlist-name">{playlist?.name}</div>
      </div>

      <div>
        <ol>
          {playlistDetail.items?.map((item) => {
            return (
              <li
                key={item.track.id}
                className={item.track.id === musicId ? "selected-item" : "item"}
                onClick={() => {
                  setMusicId(item.track.id);
                }}
              >
                {item.track.name}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default SelectSong;
