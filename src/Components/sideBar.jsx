import React from "react";

export default function SideBar() {
  return (
    <>
      <aside className="sidebar w-[200px] shrink-0 h-creen flex justify-between flex-col ">
        <ul className="font-normal  flex flex-col place-items-start fixed  gap-15 p-4 ">
          <li>
            <a href="#" className=" w-full flex items-center p-2 ">
              <span className="ms-3 font-bold">FILMSHELF</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fa-solid fa-film"></i> Home
            </a>
          </li>
          <li>
            <a href="">
              <i class="fa-regular fa-heart"> </i> Favourites
            </a>
          </li>
          <li className="">
            <a href="">
              <i class="fa-solid fa-arrow-right-to-bracket"></i> Sign Up
            </a>
          </li>
        </ul>
      </aside>
    </>
  );
}
