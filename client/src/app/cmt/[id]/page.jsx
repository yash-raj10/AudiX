"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { BsIncognito } from "react-icons/bs";
import Image from "next/image";

const page = ({ params }) => {
  const id = params.id;
  const [cmtData, setCmtData] = useState();
  const [cmtArr, setCmtArr] = useState([]);

  const { user } = useUser();
  const imageUrl = user?.imageUrl;
  const name = user?.firstName;

  const { register, reset, handleSubmit } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    const getData = async () => {
      const id = params.id;

      // console.log(typeof id);
      try {
        const res = await axios.get(`http://localhost:8080/cmts/${id}`);
        setCmtData(res.data);
        // console.log(res.data);
      } catch (error) {
        console.log(`cmts not found`, error);
      }
    };
    getData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:8080/cmt", data);

      if (res.status === 200) {
        let Arr = cmtArr;
        Arr.push(res.data);
        setCmtArr(Arr);
        // console.log(res.data);
      } else {
        console.log(res.data.error);
      }
    } finally {
      reset();
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    // console.log(data);
    // reset();
  };

  return (
    <div className=" w-full flex flex-row justify-center h-screen ">
      <div className=" w-full sm:w-1/2  ">
        {user && (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="w-full  relative mt-4 sm:flex gap-1  ">
              <div className="w-full  relative">
                <input
                  type="text"
                  id="collage"
                  name="collage"
                  {...register("cmt")}
                  placeholder=" "
                  required
                  className={`[&:required:invalid:not(:focus)]:border-purple-300 rounded-xl peer  w-full p-5 font-light bg-white/10 border-2  outline-none transition  disabled:opacity-70 disabled:cursor-not-allowed pl-4 border-neutral-300 focus:border-black`}
                />
                <label
                  htmlFor="collage"
                  className={`absolute text-base duration-150 transform -translate-y-4 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 text-zinc-500 `}
                >
                  Comment Here 👀
                </label>
              </div>
              <div className="">
                <input
                  className="hidden"
                  type=""
                  defaultValue={imageUrl}
                  {...register("image")}
                />
              </div>

              <div className="">
                <input
                  className="hidden"
                  type=""
                  defaultValue={name}
                  {...register("name")}
                />
              </div>

              <div className="">
                <input
                  className="hidden"
                  type=""
                  defaultValue={id}
                  {...register("audiId")}
                />
              </div>

              <button
                className=" btn bg-purple-300 btn-md sm:btn-lg  mt-1 sm:mt-0 w-full sm:w-auto "
                type="submit"
              >
                ✅
              </button>
            </div>
          </form>
        )}

        <div className="mt-4">
          {!(cmtArr == [] || cmtData) && (
            <div> Nothing is there, Be the first one to Comment!</div>
          )}
          {cmtArr?.toReversed().map((cmt) => (
            <div className="w-full border-2 rounded-xl border-purple-300 bg-purple-100 flex my-2">
              <div className=" w-1/4 flex flex-col sm:flex-row justify-center items-center border-b-2 pl-2 py-1 ">
                <Image
                  src={cmt.image}
                  width={40}
                  height={40}
                  alt="Picture of the author"
                  className="rounded-xl "
                />
                <span className=" w-full flex justify-center items-center">
                  {cmt.name}
                </span>
              </div>
              <div className="rounded-xl border-2 my-1 w-3/4 border-purple-300 bg-white  flex justify-center items-center  mr-1 p-1">
                {cmt.cmt}
              </div>
            </div>
          ))}

          {cmtData?.toReversed().map((cmt) => (
            <div className="w-full border-2 rounded-xl border-purple-300 bg-purple-100 flex my-2">
              <div className=" w-1/4 flex flex-col sm:flex-row justify-center items-center border-b-2 pl-2 py-1 ">
                <Image
                  src={cmt.image}
                  width={40}
                  height={40}
                  alt="Picture of the author"
                  className="rounded-xl "
                />
                <span className=" w-full flex justify-center items-center">
                  {cmt.name}
                </span>
              </div>
              <div className="rounded-xl border-2 my-1 w-3/4 border-purple-300 bg-white  flex justify-center items-center  mr-1 p-1">
                {cmt.cmt}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
