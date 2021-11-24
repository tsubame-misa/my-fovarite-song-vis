import { useState, useEffect } from "react";
//import { keyDict } from "../page/View";
import RaderChart from "./charts/RaderChart";
import Link from "next/link";
//import "./MetaSongInfoVis.css";

const MetaSongInfoVis = ({ id }) => {
  const [meta, setMeta] = useState(null);
  const [feature, setFeature] = useState(null);

  useEffect(() => {
    if (id !== "") {
      (async () => {
        //曲情報の取得
        const resTrack = await fetch(`api/track/meta`, {
          method: "POST",
          body: JSON.stringify(id),
        });
        const trackData = await resTrack.json();
        setMeta(trackData);

        //特徴の取得
        const resTrackFeature = await fetch(`api/track/feature`, {
          method: "POST",
          body: JSON.stringify(id),
        });
        const trackFeatureData = await resTrackFeature.json();
        setFeature(trackFeatureData);
      })();
    }
  }, [id]);

  if (id === "" || id === undefined) {
    return <div></div>;
  }

  return (
    <div>
      <div className="info-header">
        <div>
          <a
            style={{ fontSize: "1.25rem" }}
            href={meta?.external_urls?.spotify}
            target="_blank"
            rel="noopener noreferrer"
          >
            {meta?.name}
          </a>
        </div>

        <div className="artist pl-4">
          {meta?.artists?.map((item, j) => {
            return (
              <div key={j}>
                <a
                  href={item.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {j !== 0 ? " / " : []}
                  {item.name}
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <div className="columns mt-1">
        <div className="column">
          <b>テンポ：</b> {Math.round(feature?.tempo)}
        </div>
        <div className="column">
          <b>拍子：</b>
          {feature?.time_signature}拍子
        </div>
        <div className="column">
          <b>調：</b>
          {/* {keyDict[feature?.key]} */}
          {feature?.mode == 0 ? "短調" : "長調"}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="m-3" style={{ width: "350px", minWidth: "350px" }}>
          <RaderChart data={feature} />
        </div>
      </div>
      <div
        className="p-5"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <button className="button">
          <Link href={`/view/${id}`} className="has-text-black">
            <a> 曲の詳細を見る</a>
          </Link>
        </button>
      </div>
    </div>
  );
};

export default MetaSongInfoVis;
