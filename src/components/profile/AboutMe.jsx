import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";

function AboutMe() {
  return (
    <div className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-[#17152A]">
        About Me
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        Final year Engineering student. Love reading and saving money!
      </p>

      <Link
        to="/settings"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C4BF4] py-3.5 text-sm font-bold text-white transition hover:bg-[#5B3DE0] cursor-pointer shadow-md shadow-[#6C4BF4]/10 hover:-translate-y-0.5 active:translate-y-0 duration-150 text-center select-none"
      >
        <Pencil size={16} />
        Edit Profile
      </Link>
    </div>
  );
}

export default AboutMe;