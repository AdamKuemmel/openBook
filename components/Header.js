import React from "react";
import Image from "next/image";
import HeaderIcon from "./HeaderIcon";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {
  BellIcon,
  ChatIcon,
  ChevronDownIcon,
  HomeIcon,
  UserGroupIcon,
  ViewGridIcon,
} from "@heroicons/react/solid";
import {
  FlagIcon,
  PlayIcon,
  SearchIcon,
  ShoppingCartIcon,
} from "@heroicons/react/outline";

export default function Header() {
  const { data, status } = useSession();
  console.log(data);
  return (
    <div className="sticky top-0 z-50 flex items-center p-2 bg-white shadow-md lg:px-5">
      {/* left */}
      <div className="flex items-center">
        <Image
          src="https://links.papareact.com/5me"
          width={40}
          height={40}
          layout="fixed"
        />
        <div className="flex items-center p-2 ml-2 bg-gray-100 rounded-full">
          <SearchIcon className="h-6 text-gray-600" />
          <input
            className="flex items-center flex-shrink hidden ml-2 placeholder-gray-500 bg-transparent outline-none md:inline-flex"
            type="text"
            placeholder="Search Facebook"
          />
        </div>
      </div>
      {/* center */}
      <div className="flex justify-center flex-grow">
        <div className="flex space-x-6 md:space-x-2">
          <HeaderIcon active Icon={HomeIcon} />
          <HeaderIcon Icon={FlagIcon} />
          <HeaderIcon Icon={PlayIcon} />
          <HeaderIcon Icon={ShoppingCartIcon} />
          <HeaderIcon Icon={UserGroupIcon} />
        </div>
      </div>
      {/* right */}
      <div className="flex items-center justify-end sm:space-x-2">
        {/* profile pic */}
        <Image
          onClick={signOut}
          className="rounded-full cursor-pointer"
          src={data.user.image}
          width="40"
          height="40"
          layout="fixed"
        />
        <p className="hidden px-3 font-semibold whitespace-nowrap xl:inline-flex">
          {data.user.name}
        </p>
        <ViewGridIcon className="icon" />
        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <ChevronDownIcon className="icon" />
      </div>
    </div>
  );
}
