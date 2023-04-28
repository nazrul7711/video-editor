import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import style from "./VideoEdit.module.css";
import { BiTrim } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { BiText } from "react-icons/bi";
import { BiMerge } from "react-icons/bi";
import { Cloudinary } from "@cloudinary/url-gen";
import { trim, concatenate } from "@cloudinary/url-gen/actions/videoEdit";
import { Position } from "@cloudinary/url-gen/qualifiers/position";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";
import { Transformation } from "@cloudinary/url-gen";
import { fill, crop } from "@cloudinary/url-gen/actions/resize";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { useRef, useReducer, useState } from "react";
import { videoSource } from "@cloudinary/url-gen/qualifiers/concatenate";
import { text } from "@cloudinary/url-gen/qualifiers/source";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";
import { video } from "@cloudinary/url-gen/qualifiers/source";

let initialState = {
  isCrop: true,
  isMerge: false,
  isTrim: false,
  isText: false,
};
function reducerFn(state, action) {
  if (action.type === "crop") {
    return {
      isCrop: true,
      isMerge: false,
      isTrim: false,
      isText: false,
    };
  } else if (action.type === "merge") {
    return {
      isCrop: false,
      isMerge: true,
      isTrim: false,
      isText: false,
    };
  } else if (action.type === "trim") {
    return {
      isCrop: false,
      isMerge: false,
      isTrim: true,
      isText: false,
    };
  } else if (action.type === "text") {
    return {
      isCrop: false,
      isMerge: false,
      isTrim: false,
      isText: true,
    };
  }
}

function VideoEdit() {
  let [state, dispatch] = useReducer(reducerFn, initialState);
  let sourceRef = useRef();

  let params = useParams();
  let videoRef = useRef();
  let [videoUrl, setVideoUrl] = useState();
  console.log(params.videoId);
  const cld = new Cloudinary({
    cloud: {
      cloudName: "duihptvhl",
    },
  });

  const myVideo = cld.video(`${params.videoId}`);
  const myVideoUrl = cld.video(`${params.videoId}`).toURL();
  let newUrl = myVideo.resize(fill().width(950).height(550)).toURL();
  function getHeight() {
    console.log(videoRef.current.videoHeight);
    console.log(videoRef.current.videoWidth);
  }

  let croppedUrl;
  function cropHandler(e) {
    e.preventDefault();
    let formData = new FormData(e.target.form);
    let height = parseInt(formData.get("height"));
    let width = parseInt(formData.get("width"));
    let x = parseInt(formData.get("x"));
    let y = parseInt(formData.get("y"));
    console.log("kill ", typeof height, width, x, y);
    croppedUrl = myVideo.resize(crop().width(width).height(height).x(x).y(y)).toURL()
    axios.get(croppedUrl, { responseType: "blob" }).then((res) => {
      const blob = new Blob([res.data]);

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      console.log(a);
      a.download = "resizedVid.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

  }
  function resizeHandler(e) {
    e.preventDefault();
    let formDta = new FormData(e.target.form);
    let height = formDta.get("height");
    let width = formDta.get("width");
    let resizeVidUrl = myVideo.resize(fill().width(width).height(height)).toURL();
    axios.get(resizeVidUrl, { responseType: "blob" }).then((res) => {
      const blob = new Blob([res.data]);

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      console.log(a);
      a.download = "resizedVid.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });


  }
  function trimHandler(e) {
    e.preventDefault();
    let formDta = new FormData(e.target.form);
    let start = formDta.get("start");
    let end = formDta.get("end");
    let trimmedUrl = myVideo
      .videoEdit(trim().startOffset(start).endOffset(end.toString()))
      .toURL();
    axios.get(trimmedUrl, { responseType: "blob" }).then((res) => {
      const blob = new Blob([res.data]);

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      console.log(a);
      a.download = "trimmedVideo.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
  function splitHandler(e) {
    e.preventDefault();
    let formDta = new FormData(e.target.form);
    let firstStart = formDta.get("firstStart");
    let firstEnd = formDta.get("firstEnd");
    let secondStart = formDta.get("secondStart");
    let secondEnd = formDta.get("secondEnd");
    let firstVid = myVideo
      .videoEdit(trim().startOffset(firstStart).endOffset(firstEnd.toString()))
      .toURL();
    let secondVid = myVideo
      .videoEdit(
        trim().startOffset(secondStart).endOffset(secondEnd.toString())
      )
      .toURL();
    axios.get(firstVid, { responseType: "blob" }).then((res) => {
      const blob = new Blob([res.data]);

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      console.log(a);
      a.download = "firstVideo.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    axios.get(secondVid, { responseType: "blob" }).then((res) => {
      const blob = new Blob([res.data]);

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      console.log(a);
      a.download = "secondVideo.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
  function mergeHandler(e) {
    e.preventDefault();
    let formDta = new FormData(e.target.form);
    let publicId = formDta.get("publicId");
    let mergedVideoUrl = myVideo
      .resize(fill().width(300).height(200))
      .videoEdit(
        concatenate(
          videoSource(publicId).transformation(
            new Transformation().resize(fill().width(300).height(200))
          )
        )
      )
      .toURL();

    axios.get(mergedVideoUrl, { responseType: "blob" }).then((res) => {
      const blob = new Blob([res.data]);

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      console.log(a);
      a.download = "mergedVideo.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  function textHandler(e) {
    e.preventDefault();
    let formDta = new FormData(e.target.form);
    let txt = formDta.get("text");
    let textVideoUrl = myVideo
      .overlay(
        source(
          text(
            txt,
            new TextStyle("Arial", 80)
              .fontWeight("normal")
              .textAlignment("left")
          ).textColor("#FFA500")
        ).position(new Position().gravity(compass("center")))
      )
      .toURL();
    axios.get(textVideoUrl, { responseType: "blob" }).then((res) => {
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "textVideo.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
  function audioHandler(e) {
    e.preventDefault();
    let formDta = new FormData(e.target.form);
    let aud = formDta.get("audio");
    let audioVidUrl = myVideo
      .overlay(
        source(video(aud)).position(new Position().gravity(compass("center")))
      )
      .toURL();
    axios.get(audioVidUrl, { responseType: "blob" }).then((res) => {
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "audio.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
  console.log(videoUrl);
  return (
    <div className={style.container}>
      <div className={style.sidebar}>
        <button onClick={() => dispatch({ type: "crop" })}>
          <FiSettings />
          Crop and Resize
        </button>
        <button onClick={() => dispatch({ type: "trim" })}>
          <BiTrim />
          Trim and Split
        </button>
        <button onClick={() => dispatch({ type: "merge" })}>
          <BiMerge />
          Merge Clips
        </button>
        <button onClick={() => dispatch({ type: "text" })}>
          <BiText />
          Add Text or Audio
        </button>
      </div>
      <div className={style.display}>
        <video ref={videoRef} width="640" height="360" controls>
          <source src={myVideoUrl} type="video/mp4" />
        </video>
      </div>
      <div className={style.settings}>
        {state.isCrop && (
          <div className={style.cropSection}>
            <h1>Crop Video</h1>
            <form>
              <input type="number" name="height" placeholder="Height" />
              <input type="number" name="width" placeholder="Width" />
              <input type="number" name="x" placeholder="X coordinate" />
              <input type="number" name="y" placeholder="Y coordinate" />
              <button onClick={cropHandler}>Crop Video</button>
            </form>

            <h1>Resize Video</h1>
            <form>
              <input type="number" name="height" placeholder="Height" />
              <input type="number" name="width" placeholder="Width" />
              <button onClick={resizeHandler}>Resize Video</button>
            </form>
          </div>
        )}
        {state.isTrim && (
          <div className={style.trimSection}>
            <h1>Trim Video</h1>
            <form>
              <input
                type="number"
                name="start"
                id={style.start}
                placeholder="Start Offset"
              />

              <input
                type="number"
                name="end"
                id={style.end}
                placeholder="End Offset"
              />
              <br />
              <button onClick={trimHandler}>Trim Video</button>
            </form>
            <br />
            <br />
            <h1>Split Video</h1>
            <form>
              <input
                type="number"
                name="firstStart"
                placeholder="first video start"
              />
              <input
                type="number"
                name="firstEnd"
                placeholder="first video end"
              />
              <input
                type="number"
                name="secondStart"
                placeholder="second video start"
              />
              <input
                type="number"
                name="secondEnd"
                placeholder="second video end"
              />
              <br />
              <button onClick={splitHandler}>Split Video</button>
            </form>
          </div>
        )}
        {state.isText && (
          <div className={style.textSection}>
            <h1>Add Text</h1>
            <form>
              <input type="text" name="text" placeholder="Write Text" />
              <br />
              <button onClick={textHandler}>Add Text</button>
            </form>
            <br />
            <br />
            <h1>Add Audio</h1>
            <form>
              <input
                type="text"
                name="audio"
                placeholder="Public id of the audio "
              />
              <br />
              <button onClick={audioHandler}>Add Audio</button>
            </form>
          </div>
        )}
        {state.isMerge && (
          <div className={style.textSection}>
            <h1>Merge Clips</h1>
            <form>
              <input
                type="text"
                name="publicId"
                placeholder="Public Id of Other File"
              />
              <button onClick={mergeHandler}>Merge Videos</button>
            </form>
          </div>
        )}
      </div>
      <div className={style.stats}></div>
    </div>
  );
}

export default VideoEdit;

//{useReducer}
