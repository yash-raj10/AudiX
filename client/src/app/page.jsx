import Rec from "@/components/rec";
import { currentUser } from "@clerk/nextjs/server";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  const imageUrl = user?.imageUrl;
  const firstName = user?.firstName;
  const primaryEmailAddress = user?.primaryEmailAddress?.emailAddress;

  return (
    <div>
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
            <div className="btn btn-info">
              {" "}
              <SignInButton />
              to Audi
            </div>
          </SignedOut>
          <SignedIn>{/* <UserButton /> */}</SignedIn>
        </div>
      )}
    </div>
  );
}
