import { useEffect, useState } from "react";
import Post from "./Post";

export default function Indexpage() {
  const [posts, setposts] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACK_END}/post`).then((response) => {
      response.json().then((posts) => {
        setposts(posts);
      });
    });
  }, []);

  return <>{posts.length > 0 && posts.map((post) => <Post {...post} />)}</>;
}
