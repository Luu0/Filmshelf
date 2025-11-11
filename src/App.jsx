import React from "react";
import Home from "./home.jsx";
import SideBar from "./Components/sideBar.jsx";
import Search from "./Components/search.jsx";

export default function App() {
  return (
    <>
      <div className="flex min-h-screen  ">
        <SideBar />
        <div className=" flex flex-1">
          <Home />
        </div>
      </div>
    </>
  );
}
