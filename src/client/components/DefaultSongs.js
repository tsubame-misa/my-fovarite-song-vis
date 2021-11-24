import { useState, useEffect } from "react";
import { Link } from "next/link";
import RaderChart from "./charts/RaderChart";
import { keyDict } from "./keyInfo";

export const musicIDs = [
  {
    id: "2kRpKqkq1yYpEZeIjileCb",
    name: "Baby Got Bless You",
    path: "/baby_got_bless_you.json",
  },
  {
    id: "2IfDe0PZ7ZY4cIL73FklGf",
    name: "For Tomorrow",
    path: "/for_tomorrrow.json",
  },
  { id: "3b9Zaw3qWoRcepM8lSiYgm", name: "日々", path: "/hibi.json" },
  { id: "0a3587n25Xhw098UeEbeJq", name: "青と夏", path: "/aotonatsu.json" },
  {
    id: "7q95phyggm9icZTBurwpI4",
    name: "wi(l)d-screen baroque",
    path: "/wild-screenbaroque.json",
  },
  {
    id: "6INSmqwtKnVeVqfqPznAFU",
    name: "Happiness on High - Tokyo Disney Resort 30th Anniversary Fire Work",
    path: "/Happiness_on_High_TokyoDisneyResort30.json",
  },
  {
    id: "5QAZVZA3FN1s368XgijXHZ",
    name: "ultra soul",
    path: "/ultra_soul.json",
  },
  {
    id: "3UqIt9prWWiZCyl3WwDK3I",
    name: "ふたりごと",
    path: "/hutarigoto.json",
  },
  {
    id: "2j9XIojk4d5oxjaU2KsRWb",
    name: " MEDAL SUZDAL PANIC◎○●",
    path: "/MEDAL_SUZDAL_PANIC.json",
  },
  {
    id: "30MH35NPiE2zKSJY1nFv3N",
    name: "キューティーハニー",
    path: "/cuty_hunny.json",
  },
];

function DefaultSongs() {
  const [song, setSong] = useState("/baby_got_bless_you.json");
  const [meta, setMeta] = useState(null);
  const [musicID, setMusicID] = useState("2kRpKqkq1yYpEZeIjileCb");
  const [feature, setFeature] = useState(null);

  useEffect(() => {
    (async () => {
      // 分析データの取得
      const resFeatureData = await fetch(`api/track/feature`, {
        method: "POST",
        body: JSON.stringify(musicID),
      });
      const featureData = await resFeatureData.json();
      setFeature(featureData);

      //曲情報の取得
      const resTrack = await fetch(`api/track/meta`, {
        method: "POST",
        body: JSON.stringify(musicID),
      });
      const trackData = await resTrack.json();
      setMeta(trackData);
    })();
  }, [musicID]);
  console.log(feature);
  console.log(meta);

  return (
    <div className="section pb-0">
      {/* <div className="subtitle is-4 mb-2">曲名を選択してください</div>
      <div className="select">
        <select
          onChange={(e) => {
            setSong(e.target.value);
            setMusicID(e.target.value);
          }}
        >
          <option value="2kRpKqkq1yYpEZeIjileCb">Baby god bless you</option>
          <option value="2IfDe0PZ7ZY4cIL73FklGf">For Tomorrow</option>
          <option value="3b9Zaw3qWoRcepM8lSiYgm">日々</option>
          <option value="0a3587n25Xhw098UeEbeJq">青と夏</option>
          <option value="3UqIt9prWWiZCyl3WwDK3I">ふたりごと</option>
          <option value="5QAZVZA3FN1s368XgijXHZ">ultra soul</option>
          <option value="7q95phyggm9icZTBurwpI4">wi(l)d-screen baroque</option>
          <option value="6INSmqwtKnVeVqfqPznAFU">
            Happiness on High - Tokyo Disney Resort 30th Anniversary Fire Work
          </option>
          <option value="2j9XIojk4d5oxjaU2KsRWb">MEDAL SUZDAL PANIC◎○●</option>
          <option value="30MH35NPiE2zKSJY1nFv3N">キューティーハニー</option>
        </select>
      </div>

      <div className="hero">
        <div className="hero-body" style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              className=""
              style={{
                width: "30%",
                fontSize: "1.125rem",
                minWidth: "175px",
                //maxWidth: "250px",
              }}
            >
              <div>
                <div className="py-1">
                  <b> 曲名</b>
                  <br />
                  <div className="pl-4">
                    <a
                      href={meta?.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {meta?.name}
                    </a>
                  </div>
                </div>
                <div className="py-1">
                  <b>アーティスト</b>
                  <br />
                  {meta?.artists.map((item2, j) => {
                    return (
                      <div className="pl-4" key={j}>
                        <a
                          href={item2.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {j !== 0 ? " / " : []}
                          {item2.name}
                        </a>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 pb-1">
                  <b>テンポ：</b> {Math.round(feature?.tempo)}
                </div>
                <div className="py-1">
                  <b>拍子：</b>
                  {feature?.time_signature}拍子
                </div>
                <div className="py-1">
                  <b>調：</b>
                  {keyDict[feature?.key]}
                  {feature?.mode == 0 ? "短調" : "長調"}
                </div>
              </div>
            </div>
            <div className="m-3" style={{ width: "350px", minWidth: "350px" }}>
              <RaderChart data={feature} />
            </div>
          </div>
          <div
            className="p-5"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button className="button">
              <Link to={`/view/${musicID}`} className="has-text-black">
                曲の詳細を見る
              </Link>
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default DefaultSongs;
