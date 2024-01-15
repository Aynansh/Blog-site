import react from "react";
import reactdom from "react-dom";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import Layout from "./Layout";
import Indexpage from "./Indexpage";
import Loginpage from "./Loginpage";
import Register from "./Register";
import Createpost from "./Createpost";
import { UserContextProvider } from "./usercontext";
import Postpage from "./Postpage";
import Editpost from "./Editpost";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Indexpage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<Createpost />} />
          <Route path="/post/:id" element={<Postpage />} />
          <Route path="/edit/:id" element={<Editpost />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
