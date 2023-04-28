import React from "react";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiScissors } from "react-icons/fi";

function UploadWidget(props) {
  let cloudinaryRef = useRef();
  let widgetRef = useRef();
  let navigate = useNavigate();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "duihptvhl",
        uploadPreset: "xbsx0hh2",
      },
      function (err, res) {
        if (res.event === "success") {
          navigate(`edit/${res.info.public_id}`);
        }
      }
    );
  }, []);
  return (
    <div>
      <button onClick={() => widgetRef.current.open()}>
        <FiScissors/>
        Create Project</button>
    </div>
  );
}

export default UploadWidget;
