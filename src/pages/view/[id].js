import { useRouter } from "next/dist/client/router";

function View(v) {
  const router = useRouter();
  const id = router.query.id;
  return <div>hello</div>;
}

export default View;
