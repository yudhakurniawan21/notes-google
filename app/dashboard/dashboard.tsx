"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  const fetchNotes = async () => {
    const response = await fetch("/api/notes");
    if (response.ok) {
      const data = await response.json();
      setNotes(data);
    }
  };

  const addNote = async () => {
    if (title !== "" && content !== "") {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      fetchNotes();
      setTitle("");
      setContent("");
    } else {
      setStatus("warning");
    }
  };

  useEffect(() => {
    if (session) fetchNotes();
  }, [session]);

  if (!session) {
    return (
      <div>
        <h1>Please Log In</h1>
        <button onClick={() => signIn()}>Sign In with Google</button>
      </div>
    );
  }

  const AlertWarning = () => {
    return (
      <div role="alert" className="flex flex-row alert alert-warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Warning: please input Title and Content!</span>
      </div>
    );
  };

  return (
    <main>
      <div className="flex flex-row justify-between px-2">
        <h1>Welcome, {session.user?.name}</h1>
      </div>

      <div className="flex flex-col gap-2 px-2 mt-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="input input-bordered w-full"
        />
        <textarea
          className="textarea textarea-bordered"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        ></textarea>
        <button
          className="btn btn-sm sm:btn-md md:btn-md lg:btn-lg"
          onClick={addNote}
        >
          Add Note
        </button>
        {status === "warning" && AlertWarning()}
      </div>

      <div className="flex flex-col gap-2 px-2 mt-4 mb[70]">
        {notes.map((note: Note) => (
          <div className="card bg-primary text-primary-content" key={note.id}>
            <div className="card-body">
              <h2 className="card-title">{note.title}</h2>
              <p>{note.content}</p>
              {/* <div className="card-actions justify-end">
                <button className="btn">Buy Now</button>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
