import { useState, useEffect } from "react";
import SelectPlayList from "../client/components/SelectPlayList";

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
        <div className="auth-button-group">
          <form action="api/auth/login" method="post">
            <button type="submit">login</button>
          </form>
        </div>
      </div>
    );
  }

  console.log(playlistData);

  return (
    <div>
      <div className="auth-button-group">
        <form action="api/auth/logout" method="post">
          <button type="submit">logout</button>
        </form>
      </div>
      <SelectPlayList userData={userData} playlistData={playlistData} />
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
