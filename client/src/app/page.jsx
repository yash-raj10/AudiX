"use client";
import Image from "next/image";
import { FaMicrophone } from "react-icons/fa";
import { useState } from "react";
import CapturAudio from "./Components/capturAudio";

export default function Home() {
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="  border-2 px-4  py-2 rounded-3xl mt-3 max-w-3xl flex ">
        <>
          {!showAudioRecorder && (
            <button>
              <FaMicrophone
                className=" cursor-pointer text-2xl  "
                title="Record"
                onClick={() => setShowAudioRecorder(true)}
              />
            </button>
          )}
        </>
        {showAudioRecorder && <CapturAudio hide={setShowAudioRecorder} />}
      </div>
    </div>
  );
}
