import React from "react";
import { SiAudioboom } from "react-icons/si";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquareGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

import Link from "next/link";

const Footer = () => {
  return (
    <footer
      className="footer footer-center bg-primary text-primary-content p-10 mt-5
    "
    >
      <aside>
        <SiAudioboom size={50} />

        <p className="font-bold mt-2">
          AudiX
          <br />X but in Audio!
        </p>
        <p>Copyright © ${new Date().getFullYear()} - All right reserved</p>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <Link href="https://x.com/yashrajstwt">
            <FaSquareXTwitter size={30} />
          </Link>

          <Link href="https://github.com/yash-raj10">
            <FaSquareGithub size={30} />
          </Link>

          <Link href="https://www.linkedin.com/in/yash-raj-in/">
            <FaLinkedin size={30} />
          </Link>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
