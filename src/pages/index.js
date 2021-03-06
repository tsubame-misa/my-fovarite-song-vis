import { useState, useEffect } from "react";
import SelectPlayList from "../client/components/SelectPlayList";
import Header from "../client/components/Header";
import DefaultSongs from "../client/components/DefaultSongs";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);

  useEffect(() => {
    (async () => {
      // //ユーザーデータの取得
      const resUser = await fetch(`api/me`, {
        method: "GET",
      });
      const userData = await resUser.json();
      setUserData(userData);

      //プレイリストの取得
      const resPlaylist = await fetch(`api/playlists`, {
        method: "GET",
      });
      const playlistData = await resPlaylist.json();
      setPlaylistData(playlistData);
    })();
  }, []);

  if (userData === null || userData === undefined) {
    return (
      <div>
        <Header />
        <div className="hello-user">
          <div className="auth-button-group">
            <form action="api/auth/login" method="post">
              <button type="submit" className="button">
                ログイン
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  //アクセストークンの有効期限が切れた時の処理を書かないといけない

  return (
    <div>
      <Header />
      <section
        className="section bg-black"
        style={{ paddingTop: "24px", paddingBottom: "24px" }}
      >
        <div className="container">
          <div className="hello-user">
            <div className="auth-button-group">
              <form action="api/auth/logout" method="post">
                <button type="submit" className="button">
                  ログアウト
                </button>
              </form>
            </div>
            <div className="hello-user">
              {userData?.display_name}さん &ensp; My Favorite Songs
              Visへようこそ
            </div>
            <SelectPlayList userData={userData} playlistData={playlistData} />
          </div>
        </div>
      </section>
    </div>
  );
}

//getServerSidePropsは予約語、exportすると勝手に呼ばれる
// export async function getServerSideProps(ctx) {
//   return { props: {} };
// }

// get は　キャッシュ、 postは見ない

//pagesに置くのは,ブラウザのやつとapi系
//コンポーネントとして使うのは外に出さないとダメ
