"use client";
import Image from "next/image";
import { FaMicrophone } from "react-icons/fa";
import { useState } from "react";
import CapturAudio from "@/components/capturAudio";
import { Button } from "@/components/ui/button";

export default function Rec({ imageUrl, name, email }) {
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="  border-2 px-4  py-2 rounded-3xl mt-3 max-w-3xl flex ">
        <>
          {!showAudioRecorder && (
            <div
              className="flex items-center justify-center gap-3"
              onClick={() => setShowAudioRecorder(true)}
            >
              <FaMicrophone
                className=" cursor-pointer text-2xl  "
                title="Record"
              />

              <Button variant="outline">Rec Audi 👀</Button>
            </div>
          )}
        </>
        {showAudioRecorder && (
          <CapturAudio
            hide={setShowAudioRecorder}
            image={imageUrl}
            name={name}
            email={email}
          />
        )}
      </div>
    </div>
  );
}
