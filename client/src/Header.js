import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./usercontext";

export default function Header() {
  const { setuserinfo, userinfo } = useContext(UserContext);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACK_END}/profile`, {
      credentials: "include",
    }).then((response) => {
      response.json().then((userinfo) => {
        setuserinfo(userinfo);
      });
    });
  }, []);

  function logout() {
    fetch(`${process.env.REACT_APP_BACK_END}/logut`, {
      credentials: "include",
      method: "POST",
    });
    setuserinfo(null);
  }

  const username = userinfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        Blog site
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
