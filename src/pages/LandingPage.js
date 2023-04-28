import style from "./LandingPage.module.css";
import UploadWidget from "../components/UploadWidget";
import axios from "axios";

import { FaHome } from "react-icons/fa";
import { HiTemplate } from "react-icons/hi";
import { FaFolder } from "react-icons/fa";
import { FaPodcast } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { FaWindowClose } from "react-icons/fa";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiScissors } from "react-icons/fi";
import { FiVideo } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";

function LandingPage() {
  let [show, setShow] = useState(false);
  let [videoArr, setVideoArr] = useState([]);
  function videoAddToArr(video) {
    setVideoArr([ ...videoArr,video]);
  }
  console.log(videoArr)

  return (
    <div className={style.container}>
      <aside className={style.side}>
        <div className={style.sideBarMenuTop}>
          <h1>Veed.IO</h1>
          <div className={style.profile}>
            <p>Dharmendra</p>
          </div>
          <button>New Video +</button>
        </div>

        <div className={style.sideBarMenu}>
          <div>
            <FaHome />
            Home
          </div>
          <div>
            <HiTemplate />
            Templates
          </div>
          <div>
            <FaFolder />
            All Videos
          </div>
          <div>
            <FaPodcast />
            Podcast and Shows
          </div>
        </div>
      </aside>
      <main className={style.main}>
        <nav>
          <div className={style.searchVid}>
            <FiSearch />
            <input type="text" placeholder="Search..." />
          </div>
          <div className={style.navOther}>
            <FaRegQuestionCircle />
            <img
              src="https://images.pexels.com/photos/10384486/pexels-photo-10384486.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
              alt=""
            />
          </div>
        </nav>
        <div className={style.project}>
          <UploadWidget addToArr={videoAddToArr} />
          <button>
            <FiVideo />
            Record Video
          </button>
        </div>
        <div className={style.recentVideo}>
          <h3>Recent Videos</h3>
          <ul>
            {videoArr.map(video=><li>{video}</li>)}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
