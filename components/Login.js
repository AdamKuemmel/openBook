import React from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="grid place-items-center">
      <Image
        src="https://links.papareact.com/t4i"
        height={400}
        width={400}
        objectFit="contain"
      />
      <h1
        onClick={signIn}
        className="p-5 text-center text-white bg-blue-500 rounded-full cursor-pointer"
      >
        Login with Facebook
      </h1>
    </div>
  );
}
