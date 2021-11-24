import { useRouter } from "next/dist/client/router";
import { useState, useEffect } from "react";
import { keyDict, hueDark, keyDictEng } from "../../client/components/keyInfo";
import * as d3 from "d3";
import Link from "next/link";

function convertTime(second) {
  function zeroPadding(num, length) {
    return ("0000000000" + num).slice(-length);
  }
  const min = Math.floor(Math.floor(second) / 60);
  const sec = zeroPadding(Math.floor(second % 60), 2);
  return String(min) + ":" + String(sec);
}

function coloJudge(key, pitch) {
  const colorScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range(["#FFFFFF", hueDark[key]]);

  const color = colorScale(pitch);
  return color;
}

function View() {
  const router = useRouter();
  const id = router.query.id;

  const [song, setSong] = useState(null);
  const [data, setData] = useState([]);
  const [bar, setBar] = useState([]);
  const [beats, setBeats] = useState([]);
  const [show, setShow] = useState(false);
  const [clientX, setClientX] = useState(0);
  const [clientY, setClientY] = useState(0);
  const [meta, setMeta] = useState(null);
  const [info, setInfo] = useState({ musicKey: "", time: "" });

  useEffect(() => {
    (async () => {
      // 分析データの取得
      const resAnalysisData = await fetch(`../api/track/analysis`, {
        method: "POST",
        body: JSON.stringify(id),
      });
      const analysisData = await resAnalysisData.json();

      const sectionData = await analysisData.sections;
      const Data = analysisData.segments;
      for (let s = 1; s < sectionData.length; s++) {
        for (let d of Data) {
          if (
            sectionData[s - 1].start <= d.start &&
            d.start < sectionData[s].start
          ) {
            d["key"] = sectionData[s].key;
          } else if (d.start > sectionData[sectionData.length - 1].start) {
            d["key"] = sectionData[s - 1].key;
          }
        }
      }
      setData(Data);
      setBar(analysisData.bars);
      setBeats(analysisData.beats);

      //曲情報の取得
      const resTrack = await fetch(`../api/track/meta`, {
        method: "POST",
        body: JSON.stringify(id),
      });
      const trackData = await resTrack.json();
      setMeta(trackData);
    })();
  }, [id]);

  // データの作成とか
  const AllData = [];
  for (const d of data) {
    d.name = "segment";
    AllData.push(d);
  }
  for (const d of bar) {
    d.name = "bar";
    AllData.push(d);
  }
  for (const d of beats) {
    d.name = "beat";
    AllData.push(d);
  }
  AllData.sort((a, b) => a.start - b.start);

  const scale = d3.scaleLinear().domain([0, 1]).range(["#FFFFFF", "#0C060F"]);
  const margin = {
    left: 100,
    right: 100,
    top: 500,
    bottom: 100,
  };
  const contentWidth = 4500; //5分
  const contentHeight = 250;

  const xScale2 = d3
    .scaleLinear()
    .domain(d3.extent(data, (item) => item.start))
    .range([0, contentWidth])
    .nice();

  //これも何かしらの計算で出した方がいい
  const scaleSize = 15 * (AllData[AllData?.length - 1]?.start / 300);

  let musicKey = data[0]?.key;
  let testPadY = 0;
  let testPadX = 0;
  let testPadY2 = 0;
  let testPadX2 = 0;
  const pt = 40;
  const padding = 10;
  const linePadding = 25;
  const scoreHeight = 450;

  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight =
    margin.top +
    margin.bottom +
    contentHeight +
    Math.ceil(
      xScale2((AllData[AllData?.length - 1]?.start * scaleSize) / contentWidth)
    ) *
      scoreHeight;

  const dBScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (item) => item.loudness_max))
    .range([2.5, linePadding - 5])
    .nice();
  const dBDiff = dBScale.domain();

  const opacityScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0.5, 0.75])
    .nice();

  let barCnt = 0;

  function onHover(item) {
    setShow(true);
    setClientX(item.x);
    setClientY(item.y);
    if (item.name === "segment") {
      setInfo({
        onpu: true,
        key: item.key,
        time: convertTime(item.start),
        pitches: item.pitches,
        loudness_max: Math.round(item.loudness_max * 10) / 10,
      });
    } else {
      setInfo({
        onpu: false,
        key: item.key,
        time: convertTime(item.start),
      });
    }
  }

  if (data.length === 0) {
    return (
      <div
        style={{
          fontSize: "1.5rem",
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        loading...
      </div>
    );
  }

  return (
    <div>
      <main>
        <section className="section">
          <div style={{ display: "flex" }}>
            <div className="subtitle is-3 pb-4">
              <a
                href={meta?.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
              >
                {meta?.name}
              </a>
            </div>
          </div>

          <div style={{ width: "100%", height: "90vh" }}>
            <svg
              viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
            >
              <g>
                <text
                  x="0"
                  y={-margin.top / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="75"
                  style={{ userSelect: "none" }}
                  fontFamily="San Francisco"
                >
                  音量
                </text>
                <text
                  x="220"
                  y={-margin.top / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="60"
                  style={{ userSelect: "none" }}
                >
                  {dBDiff[0]}dB
                </text>
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const sound_r =
                    dBDiff[0] + ((dBDiff[1] - dBDiff[0]) / 5) * idx;
                  return (
                    <g key={idx}>
                      <circle
                        cx={275 + 80 * idx}
                        cy={-margin.top / 2}
                        r={dBScale(sound_r)}
                        fill="black"
                        opacity="0.5"
                        strokeWidth="0.1px"
                        stroke="black"
                      />
                    </g>
                  );
                })}
                <text
                  x="800"
                  y={-margin.top / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="60"
                  style={{ userSelect: "none" }}
                >
                  {dBDiff[1]}dB
                </text>
              </g>
              <g>
                <defs>
                  <linearGradient id="Gradient2">
                    <stop offset="0%" stopColor={scale(0)} />
                    <stop offset="5%" stopColor={scale(0.05)} />
                    <stop offset="10%" stopColor={scale(0.1)} />
                    <stop offset="15%" stopColor={scale(0.15)} />
                    <stop offset="20%" stopColor={scale(0.2)} />
                    <stop offset="25%" stopColor={scale(0.25)} />
                    <stop offset="30%" stopColor={scale(0.3)} />
                    <stop offset="35%" stopColor={scale(0.35)} />
                    <stop offset="40%" stopColor={scale(0.4)} />
                    <stop offset="45%" stopColor={scale(0.45)} />
                    <stop offset="50%" stopColor={scale(0.5)} />
                    <stop offset="55%" stopColor={scale(0.55)} />
                    <stop offset="60%" stopColor={scale(0.6)} />
                    <stop offset="65%" stopColor={scale(0.65)} />
                    <stop offset="70%" stopColor={scale(0.7)} />
                    <stop offset="75%" stopColor={scale(0.75)} />
                    <stop offset="80%" stopColor={scale(0.8)} />
                    <stop offset="85%" stopColor={scale(0.85)} />
                    <stop offset="90%" stopColor={scale(0.9)} />
                    <stop offset="95%" stopColor={scale(0.95)} />
                    <stop offset="100%" stopColor={scale(1)} />
                  </linearGradient>
                </defs>
                <g /*transform={`rotate(90)`}*/>
                  <text
                    x="1100"
                    y={-margin.top / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="75"
                    style={{ userSelect: "none" }}
                    fontFamily="San Francisco"
                  >
                    出現確率
                  </text>
                  <rect
                    x="1330"
                    y={-margin.top / 2 - 25}
                    width="500"
                    height="50"
                    fill="url('#Gradient2')"
                  />
                  <text
                    x="1290"
                    y={-margin.top / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="60"
                    style={{ userSelect: "none" }}
                  >
                    0
                  </text>
                  <text
                    x="1865"
                    y={-margin.top / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="60"
                    style={{ userSelect: "none" }}
                  >
                    1
                  </text>
                </g>
              </g>
              <g>
                <text
                  x="2000"
                  y={-margin.top / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="75"
                  style={{ userSelect: "none" }}
                  fontFamily="San Francisco"
                >
                  キー
                </text>
                {hueDark.map((color, c) => {
                  return (
                    <g key={c}>
                      <rect
                        x={2150 + 225 * c}
                        y={-margin.top + margin.top / 4}
                        width="15"
                        height="200"
                        fill={color}
                      />
                      <text
                        x={2150 + 225 * c + 5}
                        y={-margin.top + 50}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="75"
                        style={{ userSelect: "none" }}
                        fontFamily="San Francisco"
                      >
                        {keyDictEng[c]}
                      </text>
                    </g>
                  );
                })}
              </g>
              <g>
                {AllData.map((item, i) => {
                  item.x = xScale2(item.start) * scaleSize + testPadX;
                  item.y = -pt / 2 + testPadY;
                  if (item.key === undefined) {
                    item.key = musicKey;
                  }
                  //item.key = musicKey;
                  if (
                    i === 0 ||
                    testPadX + xScale2(item.start) * scaleSize > contentWidth
                  ) {
                    if (i !== 0) {
                      item.x =
                        xScale2(item.start) * scaleSize +
                        testPadX -
                        contentWidth;
                      item.y = -pt / 2 + testPadY + scoreHeight;
                      testPadY += scoreHeight;
                      testPadX -= contentWidth;
                    }
                    return [
                      [0, 0],
                      [1, 1],
                      [2, 0],
                      [3, 1],
                      [4, 0],
                      [5, 1],
                      [6, 0],
                      [7, 0],
                      [8, 1],
                      [9, 0],
                      [10, 1],
                      [11, 0],
                    ].map((idx) => {
                      return (
                        <g key={idx}>
                          {/**五線 */}
                          <line
                            x1={0}
                            y1={pt + linePadding * idx[0] + testPadY}
                            x2={contentWidth}
                            y2={pt + linePadding * idx[0] + testPadY}
                            strokeWidth="0.25px"
                            stroke="black"
                          />
                          {/**鍵盤 */}
                          <g transform={`translate(0, -2.5)`}>
                            {idx[1] === 0 ? (
                              <rect
                                x={-linePadding * 3.5}
                                y={pt / 2 + linePadding * idx[0] + testPadY}
                                width={linePadding * 3}
                                height={linePadding * 1.25}
                                fill="#E8E8E8"
                              />
                            ) : (
                              <g>
                                <rect
                                  x={-linePadding * 3.5}
                                  y={pt / 2 + linePadding * idx[0] + testPadY}
                                  width={linePadding * 2}
                                  height={linePadding}
                                  // stroke="black"
                                  fill="black"
                                />
                                <rect
                                  x={-linePadding * 1.5}
                                  y={pt / 2 + linePadding * idx[0] + testPadY}
                                  width={linePadding}
                                  height={linePadding}
                                  fill="#E8E8E8"
                                />
                              </g>
                            )}
                          </g>
                          {/**終始線 */}
                          {idx[0] === 0 ? (
                            <g>
                              <line
                                x1={0}
                                y1={pt + testPadY}
                                x2={0}
                                y2={pt + linePadding * 11 + testPadY}
                                strokeWidth="0.4px"
                                stroke="black"
                              />
                              <line
                                x1={contentWidth}
                                y1={pt + testPadY}
                                x2={contentWidth}
                                y2={pt + linePadding * 11 + testPadY}
                                strokeWidth="0.5px"
                                stroke="black"
                              />
                            </g>
                          ) : (
                            []
                          )}
                        </g>
                      );
                    });
                  }
                  if (item.name === "beat") {
                    return (
                      <g key={i}>
                        {/**線が細すぎて押しにくいのでダミー */}
                        <line
                          x1={xScale2(item.start) * scaleSize + testPadX}
                          y1={-pt / 2 + testPadY}
                          x2={xScale2(item.start) * scaleSize + testPadX}
                          y2={pt / 2 + linePadding * 12 + testPadY}
                          strokeWidth="50px"
                          opacity="0"
                          stroke={coloJudge(musicKey, 1)}
                          onMouseEnter={() => onHover(item)}
                          onMouseLeave={() => setShow(false)}
                        />
                        <line
                          x1={xScale2(item.start) * scaleSize + testPadX}
                          y1={pt + testPadY}
                          x2={xScale2(item.start) * scaleSize + testPadX}
                          y2={pt + linePadding * 11 + testPadY}
                          strokeWidth="1.5px"
                          stroke={coloJudge(musicKey, 1)}
                        />
                      </g>
                    );
                  } else if (item.name === "bar") {
                    barCnt += 1;
                    return (
                      <g key={i}>
                        {/**線が細すぎて押しにくいのでダミー */}
                        <line
                          x1={xScale2(item.start) * scaleSize + testPadX}
                          y1={-pt / 2 + testPadY}
                          x2={xScale2(item.start) * scaleSize + testPadX}
                          y2={(pt * 3) / 2 + linePadding * 12 + testPadY}
                          strokeWidth="50px"
                          opacity="0"
                          stroke={coloJudge(musicKey, 1)}
                          onMouseEnter={() => onHover(item)}
                          onMouseLeave={() => setShow(false)}
                        />
                        <line
                          x1={xScale2(item.start) * scaleSize + testPadX}
                          y1={pt + testPadY}
                          x2={xScale2(item.start) * scaleSize + testPadX}
                          y2={pt + linePadding * 11 + testPadY}
                          strokeWidth="8px"
                          stroke={coloJudge(musicKey, 1)}
                        />

                        {barCnt % 6 === 0 ? (
                          <g>
                            <text
                              x={xScale2(item.start) * scaleSize + testPadX}
                              y={-pt + testPadY}
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize="60"
                              style={{ userSelect: "none" }}
                              //key={i}
                            >
                              {convertTime(item.start)}
                            </text>
                          </g>
                        ) : (
                          []
                        )}
                      </g>
                    );
                  } else if (item.name === "segment") {
                    musicKey = item.key;
                  }
                })}
              </g>
              <g>
                {AllData.map((item, i) => {
                  if (
                    i === 0 ||
                    testPadX2 + xScale2(item.start) * scaleSize > contentWidth
                  ) {
                    if (i !== 0) {
                      testPadY2 += scoreHeight;
                      testPadX2 -= contentWidth;
                    }
                  }
                  if (item.name === "segment") {
                    musicKey = item.key;
                    const pitchObj = [];
                    for (let i = 0; i < item.pitches.length; i++) {
                      pitchObj.push({ value: item.pitches[i], idx: i });
                    }
                    pitchObj.sort((a, b) => a.value - b.value);
                    return pitchObj.map((p, j) => {
                      return (
                        <g
                          id="onpu"
                          onMouseEnter={() => onHover(item)}
                          onMouseLeave={() => setShow(false)}
                          key={j}
                        >
                          <circle
                            //key={item.start}
                            cx={
                              padding +
                              xScale2(item.start) * scaleSize +
                              testPadX2
                            }
                            cy={pt + linePadding * (11 - p.idx) + testPadY2}
                            r={dBScale(item.loudness_max)}
                            //fill={coloJudge2(item.key, p.value)}
                            fill={scale(p.value)}
                            //opacity="0.5"
                            opacity={opacityScale(p.value)}
                            //style={{ transitionDuration: "1s" }}
                          />
                        </g>
                      );
                    });
                  }
                })}
              </g>
              {show ? (
                <g fontFamily="San Francisco">
                  {info.onpu === true ? (
                    <g
                      transform={`translate(${
                        clientX >= 3000 ? clientX - 900 : clientX + 150
                      },${clientY})`}
                    >
                      <rect
                        x={0}
                        y={0}
                        width="800"
                        height="450"
                        fill="#968479"
                        opacity="0.85"
                      />
                      <text
                        x={800 / 2}
                        y={75}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="100"
                        style={{ userSelect: "none" }}
                        fill="#ffffff"
                        //key={i}
                      >
                        {info.time}
                      </text>
                      <text
                        x={800 / 2}
                        y={200}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="100"
                        style={{ userSelect: "none" }}
                        fill="#ffffff"
                        //key={i}
                      >
                        キー : {keyDictEng[info.key]}
                      </text>
                      <text
                        x={800 / 2}
                        y={350}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="100"
                        style={{ userSelect: "none" }}
                        fill="#ffffff"
                        //key={i}
                      >
                        最大音量 : {info.loudness_max}
                      </text>
                    </g>
                  ) : (
                    <g
                      transform={`translate(${
                        clientX >= 4000 ? clientX - 600 : clientX + 150
                      },${clientY})`}
                    >
                      <rect
                        x={0}
                        y={0}
                        width="600"
                        height="300"
                        fill="gray"
                        opacity="0.85"
                      />
                      <text
                        x={550 / 2}
                        y={75}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="100"
                        style={{ userSelect: "none" }}
                        fill="#ffffff"
                        //key={i}
                      >
                        {info.time}
                      </text>
                      <text
                        x={550 / 2}
                        y={200}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="100"
                        style={{ userSelect: "none" }}
                        fill="white"
                        //key={i}
                      >
                        キー : {keyDictEng[info.key]}
                      </text>
                    </g>
                  )}
                </g>
              ) : (
                []
              )}
            </svg>
            <div
              className="pb-6"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button className="button">
                <Link href={`/`} className="has-text-black">
                  <a> 曲選択に戻る</a>
                </Link>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default View;
