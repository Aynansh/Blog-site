import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./usercontext";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
export default function Loginpage() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [redirect, setredirect] = useState(false);
  const { setuserinfo } = useContext(UserContext);
  async function login(e) {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_BACK_END}/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      response.json().then((userinfo) => {
        setuserinfo(userinfo);
        setredirect(true);
      });
    } else {
      alert("Invalid username or password!");
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setusername(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setpassword(e.target.value)}
      />

      <button>Login</button>
    </form>
  );
}
