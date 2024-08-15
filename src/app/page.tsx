"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { Divide, PlusIcon } from "lucide-react";
import type { Note } from "../../lib/types";

import clsx from "clsx";
import Link from "next/link";
const title = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();
  useEffect(() => {
    fetch("api/notes")
      .then((response) => response.json())
      .then((data) => {
        setNotes(data);
        setLoading(false);
        console.log("data: ", data);
      });
  }, []);

  const create = async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "Untitled", body: "" }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const data = await response.json();
      if (data && data.id) {
        router.push(`/n/${data.id}`);
      } else {
        console.error("Note creation failed, no ID returned");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  console.log(notes);

  return (
    <div className="flex">
      <div className="min-h-screen  p-10 border-white/10 border-r-2 ">
        <div
          onClick={create}
          className="p-3 bg-white rounded-full cursor-pointer hover:scale-105 ease-in-out transition-all"
        >
          <PlusIcon size={30} />
        </div>
      </div>
      <div className="p-16 container">
        <div className="">
          <h1
            className={clsx(
              "font-semibold text-white text-6xl",
              title.className
            )}
          >
            Notes
          </h1>
        </div>
        {loading && <div>Loading...</div>}
        {!loading && notes.length === 0 && (
          <div className="container flex flex-col justify-center h-[500px] items-center space-y-10 ">
            <div className="text-3xl font-bold text-white/50">Empty</div>
            <button
              onClick={create}
              className="px-4 py-2 rounded-full bg-white cursor-pointer"
            >
              Create New Notes
            </button>
          </div>
        )}
        {!loading && notes.length > 0 && (
          <div className="flex gap-4 mt-14 flex-wrap ">
            {notes.map((note) => {
              return (
                <Link key={note.id} href={`n/${note.id}`}>
                  <div className="w-72 h-72 rounded-3xl p-6 bg-[#1b1b1b] cursor-pointer hover:scale-105 ease-in-out transition-all">
                    <div className="h-full relative">
                      <h3 className="font text-2xl pb-2 text-white">
                        {note.title}
                      </h3>
                      <div className="text-lg text-white/60 ">{note.body}</div>
                      <div className="bottom-0 absolute text-white/50 text-sm">
                        {note.createdAt}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
