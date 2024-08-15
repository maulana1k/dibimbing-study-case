"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Trash, Check } from "lucide-react";
import { Button } from "@chakra-ui/react";

interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function NotePage() {
  const router = useRouter();
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/notes/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch note");
          }
          return response.json();
        })
        .then((data: Note) => {
          setNote(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching note:", error);
          setError("Failed to load note");
          setLoading(false);
        });
    }
  }, [id]);

  const handleTitleChange = useCallback(
    (e: React.FocusEvent<HTMLDivElement, Element>) => {
      if (note) {
        const newTitle = e.target.innerText;
        setNote({
          ...note,
          title: newTitle,
        });
      }
    },
    [note]
  );

  const handleBodyChange = useCallback(
    (e: React.ChangeEvent<HTMLDivElement>) => {
      if (note) {
        const newBody = e.target.innerText;
        setNote({
          ...note,
          body: newBody,
        });
      }
    },
    [note]
  );

  const handleSave = async () => {
    if (note) {
      try {
        const response = await fetch(`/api/notes/${note.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: note.title,
            body: note.body,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update note");
        }

        const updatedNote = await response.json();
        setNote(updatedNote);
        console.log("Note updated successfully:", updatedNote);
      } catch (error) {
        console.error("Error updating note:", error);
        setError("Failed to update note");
      }
    }
  };

  const handleDelete = async () => {
    if (note) {
      try {
        const response = await fetch(`/api/notes/${note.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete note");
        }

        router.push("/");
      } catch (error) {
        console.log("Error deleting note:", error);
        setError("Failed to delete note");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!note) return <p>Note not found</p>;

  return (
    <div className="px-24 py-10">
      <div className="flex items-center">
        <button
          onClick={() => router.push("/")}
          className="text-white flex items-center"
        >
          <ArrowLeft size={30} />
          <span className="ml-2">Back to notes</span>
        </button>
      </div>
      <div className="mt-10 space-y-8 text-white">
        <div
          className="text-6xl font-medium"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
        >
          {note.title}
        </div>
        <div
          className="w-full text-xl text-white/80"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBodyChange}
        >
          {note.body}
        </div>

        <div className="text-sm text-white/60">
          Created at: {new Date(note.createdAt).toLocaleString()}
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={handleDelete}
            leftIcon={<Trash />}
            colorScheme="red"
            className="px-4 py-2 bg-blue-500 text-white rounded-full"
          ></Button>
          <Button
            onClick={handleSave}
            colorScheme="blue"
            leftIcon={<Check />}
            className="px-4 py-2 bg-blue-500 text-white rounded-full"
          ></Button>
        </div>
      </div>
    </div>
  );
}
