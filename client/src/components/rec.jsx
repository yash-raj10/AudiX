"use client";
import Image from "next/image";
import { FaCommentAlt, FaMicrophone } from "react-icons/fa";
import { useState } from "react";
import CapturAudio from "@/components/capturAudio";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Rec({ imageUrl, name, email }) {
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [audiData, setAudiData] = useState(null);

  const handleAudioDataChange = (newAudioData) => {
    setAudiData(newAudioData);
  };

  return (
    <>
      <div className="flex justify-center items-center w-full">
        <div className="  border-2 px-4  py-2 rounded-3xl mt-3 max-w-3xl flex border-purple-500 bg-purple-200  ">
          <>
            {!showAudioRecorder && (
              <div
                className="flex items-center justify-center gap-3 "
                onClick={() => setShowAudioRecorder(true)}
              >
                <FaMicrophone
                  className=" cursor-pointer text-2xl  "
                  title="Record"
                />
                <div className="border-purple-400 border-2 rounded-lg">
                  <Button variant="outline">Rec Audi 👀</Button>
                </div>
              </div>
            )}
          </>
          {showAudioRecorder && (
            <CapturAudio
              hide={setShowAudioRecorder}
              image={imageUrl}
              name={name}
              email={email}
              onAudioDataChange={handleAudioDataChange}
            />
          )}
        </div>
      </div>

      {audiData && (
        <div className="w-full  flex justify-center">
          <div className="w-full md:w-1/2 lg:w-1/3 pt-1 ">
            <div className="flex flex-col items-center justify-center mt-5 border-2 px-4 py-2 rounded-xl bg-purple-100">
              <div className="w-full flex border-b-2 border-purple-500 ">
                <span className="pr-3 pl-1 pb-2  ">
                  <Image
                    src={audiData.imageUrl}
                    width={40}
                    height={40}
                    alt="Picture of the author"
                    className="rounded-xl"
                  />
                </span>
                <span className=" justify-center items-center flex font-semibold">
                  {audiData.name}
                </span>
              </div>
              <div className=" flex justify-center gap-2  w-full sm:w-auto">
                <audio controls className=" pt-3 ">
                  <source src={audiData.audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>

                <span className="flex justify-center items-center pt-3">
                  <Link href={`./cmt/${audiData._id}`}>
                    <FaCommentAlt size={30} />
                  </Link>
                </span>
              </div>

              <div>
                <form
                // onSubmit={handleSubmit(onSubmit) }
                >
                  <div className="w-full  relative mt-4 sm:flex gap-1  ">
                    <div className="w-full  relative">
                      <input
                        type="text"
                        id="collage"
                        name="collage"
                        // {...register("cmt")}
                        placeholder=" "
                        required
                        className={`[&:required:invalid:not(:focus)]:border-purple-300 rounded-xl peer  w-full p-3 font-light bg-white/10 border-2  outline-none transition  disabled:opacity-70 disabled:cursor-not-allowed pl-4 border-neutral-300 focus:border-black`}
                      />
                      <label
                        htmlFor="collage"
                        className={`absolute text-sm duration-150 transform -translate-y-4 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 text-zinc-500 `}
                      >
                        Comment Here 👀
                      </label>
                    </div>
                    <div className="">
                      <input
                        className="hidden"
                        type=""
                        // defaultValue={audi?.imageUrl}
                        // {...register("image")}
                      />
                    </div>

                    <div className="">
                      <input
                        className="hidden"
                        type=""
                        // defaultValue={audi?.name}
                        // {...register("name")}
                      />
                    </div>

                    <div className="">
                      <input
                        className="hidden"
                        type=""
                        // defaultValue={audi?._id}
                        // {...register("audiId")}
                      />
                    </div>

                    <button
                      className=" btn bg-purple-300 btn-sm sm:btn-md  mt-1 sm:mt-0 w-full sm:w-auto "
                      type="submit"
                    >
                      ✅
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
