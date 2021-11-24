import { useState } from "react";
import SelectSong from "./SelectSong";
import MetaSongInfoVis from "./MetaSongInfoVis";

function SelectPlayList({ userData, playlistData }) {
  const [playlistId, setPlaylistId] = useState("");
  const [musicId, setMusicId] = useState("");
  return (
    <div>
      <div className="columns">
        <div className="column is-2">
          <div className="playlist-header">プレイリスト</div>
          <ol>
            {playlistData?.items?.map((item) => {
              return (
                <li
                  key={item.id}
                  className={item.id === playlistId ? "selected-item" : "item"}
                  onClick={() => {
                    setPlaylistId(item.id);
                  }}
                >
                  {item.name}
                </li>
              );
            })}
          </ol>
        </div>
        <div className="column">
          <SelectSong
            id={playlistId}
            musicId={musicId}
            setMusicId={setMusicId}
          />
        </div>
        <div className="column">
          <MetaSongInfoVis id={musicId} />
        </div>
      </div>
    </div>
  );
}

export default SelectPlayList;
