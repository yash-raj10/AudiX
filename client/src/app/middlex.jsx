import React from "react";
import Rec from "@/components/rec";
import { currentUser } from "@clerk/nextjs/server";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

const Middlex = async () => {
  const user = await currentUser();
  const imageUrl = user?.imageUrl;
  const firstName = user?.firstName;
  const primaryEmailAddress = user?.primaryEmailAddress?.emailAddress;

  return (
    <div className="relative overflow-hidden">
      <div
        className="before:absolute before:top-0 before:start-1/2 before:bg-no-repeat before:bg-top before:size-full before:-z-[1] before:transform before:-translate-x-1/2"
        style={{
          "--tw-bg-opacity": "1",
          backgroundImage:
            "url('https://preline.co/assets/svg/examples/squared-bg-element.svg')",
          backgroundSize: "auto",
        }}
      >
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          <div className="flex justify-center">
            <a
              className="inline-flex items-center gap-x-2 bg-white border border-gray-200 text-xs text-gray-600 p-2 px-3 rounded-full transition hover:border-gray-300"
              href="#"
            >
              Explore Audis
              <span className="flex items-center gap-x-1">
                <span className="border-s border-gray-200 text-blue-600 ps-2">
                  Explore
                </span>
                <svg
                  className="flex-shrink-0 size-4 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </a>
          </div>

          <div className="mt-5 max-w-2xl text-center mx-auto">
            <h1 className="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl">
              AudiX: Turning Voices into Conversations..
            </h1>
          </div>

          <div className="mt-5 max-w-3xl text-center mx-auto">
            <p className="text-lg text-gray-600">
              The Social Network for Your Voice!
            </p>
          </div>

          {user ? (
            <>
              <Rec
                imageUrl={imageUrl}
                name={firstName}
                email={primaryEmailAddress}
              />
            </>
          ) : (
            <div className=" flex justify-center items-center pt-2">
              <SignedOut>
                <div className="mt-8 gap-3 flex justify-center">
                  <div className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 border border-transparent text-white text-sm font-medium rounded-full py-3 px-4">
                    <svg
                      //   className="flex-shrink size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 48 48"
                    >
                      {" "}
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      ></path>
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      ></path>
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>{" "}
                    </svg>
                    <SignInButton />
                    with Google
                  </div>
                </div>
              </SignedOut>
              <SignedIn>{/* <UserButton /> */}.</SignedIn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Middlex;
