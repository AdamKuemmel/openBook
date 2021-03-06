//react imports
import Image from "next/image";
import { React, useRef, useState } from "react";
import { useSession } from "next-auth/react";
//icon imports
import { EmojiHappyIcon } from "@heroicons/react/outline";
import { CameraIcon, VideoCameraIcon } from "@heroicons/react/solid";
//firebase imports
import { firestore } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  uploadString,
} from "firebase/storage";

export default function InputBox() {
  const { data, status } = useSession();
  const collectionRef = collection(firestore, "posts");
  const inputRef = useRef(null);
  const filePickerRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);

  const sendPost = (e) => {
    e.preventDefault();
    if (!inputRef.current.value) return;
    // Add a new document with a generated id.
    addDoc(collection(firestore, "posts"), {
      message: inputRef.current.value,
      name: data.user.name,
      email: data.user.email,
      image: data.user.image,
      timestamp: serverTimestamp(),
    }).then((docum) => {
      if (imageToPost) {
        attachPic(imageToPost, docum);
        removeImage();
      }
    });
    inputRef.current.value = "";
  };
  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setImageToPost(readerEvent.target.result);
    };
  };

  const attachPic = async (imageToPost, docum) => {
    const storage = getStorage();
    const storageRef = ref(storage, `posts/${docum.id}`);
    const uploadTask = await uploadString(storageRef, imageToPost, "data_url");
    const url = await getDownloadURL(uploadTask.ref);
    await setDoc(
      doc(firestore, "posts", docum.id),
      { postImage: url },
      { merge: true }
    );
  };
  const removeImage = () => {
    setImageToPost(null);
  };
  return (
    <div className="p-2 mt-6 font-medium text-gray-500 bg-white shadow-md rounded-2xl">
      <div className="flex items-center p-4 space-x-4">
        <Image
          className="rounded-full"
          src={data.user.image}
          width={40}
          height={40}
          layout="fixed"
        />
        <form className="flex flex-1">
          <input
            className="flex-grow h-12 px-5 bg-gray-100 rounded-full focus:outline-none"
            ref={inputRef}
            type="text"
            placeholder={`Whats on your mind, ${data.user.name}?`}
          />
          <button hidden type="submit" onClick={sendPost}>
            Submit
          </button>
        </form>
        {imageToPost && (
          <div
            onClick={removeImage}
            className="flex flex-col transition duration-150 transform cursor-pointer filter hover:brightness-110 hover:scale-105"
          >
            <img className="object-contain h-10" src={imageToPost} />
          </div>
        )}
      </div>
      <div className="flex justify-evenly">
        <div className="inputIcon">
          <VideoCameraIcon className="text-red-500 h-7" />
          <p className="text-xs sm:text-sm xl:text-base">Live Video</p>
        </div>
        <div
          className="inputIcon"
          onClick={() => filePickerRef.current.click()}
        >
          <CameraIcon className="text-green-400 h-7" />
          <p className="text-xs sm:text-sm xl:text-base">Photo/Video</p>
          <input
            onChange={addImageToPost}
            ref={filePickerRef}
            type="file"
            hidden
          />
        </div>
        <div className="inputIcon">
          <EmojiHappyIcon className="text-yellow-300 h-7" />
          <p className="text-xs sm:text-sm xl:text-base">Feeling/Activity</p>
        </div>
      </div>
    </div>
  );
}
