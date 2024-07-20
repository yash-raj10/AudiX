"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCommentAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";

const Middle = () => {
  const [audiDAta, setAudiDAta] = useState();
  const [activeAudioId, setActiveAudioId] = useState(null);
  const { user } = useUser();
  const ImageUrl = user?.imageUrl;
  const Name = user?.firstName;

  useEffect(() => {
    const getData = async () => {
      try {
        80;
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/getAudis`);
        setAudiDAta(res.data);
        // console.log(res.data);
      } catch (error) {
        console.log(`audis not found`, error);
      }
    };
    getData();
  }, []);

  const { register, reset, handleSubmit } = useForm({
    defaultValues: {},
  });

  const onSubmit = async (data) => {
    // console.log(data);
    if (!activeAudioId) {
      console.error("No audio selected for comment");
      return;
    }

    const activeAudio = audiDAta.find((audi) => audi._id === activeAudioId);
    if (!activeAudio) {
      console.error("Selected audio not found");
      return;
    }

    const commentData = {
      cmt: data.cmt,
      image: ImageUrl,
      name: Name,
      audiId: activeAudioId,
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/cmt`,
        commentData
      );
      if (res.data) {
        console.log(res.data.message);
      } else {
        console.log(res.data.error);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      reset();
      // setActiveAudioId(null);
    }

    // console.log(commentData);
    // reset();
    // setActiveAudioId(null);
  };

  return (
    <main
      className=" h-full w-full  flex justify-center before:absolute before:top-0 before:start-1/2 before:bg-no-repeat before:bg-top before:size-full before:-z-[1] before:transform before:-translate-x-1/2"
      style={{
        "--tw-bg-opacity": "1",
        backgroundImage:
          "url('https://preline.co/assets/svg/examples/squared-bg-element.svg')",
        backgroundSize: "auto",
      }}

      // className="h-full w-full  flex justify-center "
    >
      <div className="w-full md:w-1/2 lg:w-1/3 pt-1 ">
        {audiDAta?.map((audi) => (
          <div
            key={audi._id}
            className="flex flex-col items-center justify-center mt-5 border-2 px-4 py-2 rounded-xl bg-purple-100"
          >
            <div className="w-full flex border-b-2 border-purple-500 ">
              <span className="pr-3 pl-1 pb-2  ">
                <Image
                  src={audi.imageUrl}
                  width={40}
                  height={40}
                  alt="Picture of the author"
                  className="rounded-xl"
                />
              </span>
              <span className=" justify-center items-center flex font-semibold">
                {audi.name}
              </span>
            </div>

            <div className="flex justify-center items-center w-full sm:w-auto">
              <audio controls className=" pt-3   ">
                <source src={audi.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>

            <div className=" flex justify-center gap-4 pt-1  w-full sm:w-auto">
              <span className="flex flex-col justify-center items-center pt-3 text-xs">
                <Link href={`./cmt/${audi._id}`}>
                  <FaCommentAlt size={30} />
                </Link>
                <p>(Previous cmts)</p>
              </span>

              <button
                onClick={() => setActiveAudioId(audi._id)}
                className="btn bg-purple-300 btn-sm sm:btn-md mt-2"
              >
                Comment on this Audi
              </button>
            </div>

            <div>
              {activeAudioId === audi._id && (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  id={audi?._id}
                  method="none"
                  action="javascript:void(0);"
                >
                  <div className="w-full  relative mt-4 sm:flex gap-1  ">
                    <div className="w-full  relative">
                      <input
                        type="text"
                        id="comment"
                        {...register("cmt")}
                        placeholder=" "
                        required
                        className={`[&:required:invalid:not(:focus)]:border-purple-300 rounded-xl peer  w-full p-3 font-light bg-white/10 border-2  outline-none transition  disabled:opacity-70 disabled:cursor-not-allowed pl-4 border-neutral-300 focus:border-black`}
                      />
                      <label
                        htmlFor="comment"
                        className={`absolute text-sm duration-150 transform -translate-y-4 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 text-zinc-500 `}
                      >
                        Comment Here 👀
                      </label>
                    </div>

                    <button
                      className=" btn bg-purple-300 btn-sm sm:btn-md  mt-1 sm:mt-0 w-full sm:w-auto "
                      type="submit"
                    >
                      ✅
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Middle;
