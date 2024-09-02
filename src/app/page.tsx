"use client";
import axios from "axios";
import { useRef, MouseEvent, useState } from "react";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault(); 
    inputRef.current?.click(); 
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleFileSubmit = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", message);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload successful", response.data);
      alert("Upload successful");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="items-center justify-center">
        <div className="bg-zinc-50 rounded-[10px] text-black">
          <h1 className="justify-start font-bold p-3">
            Upload file to your channel
          </h1>
          <hr />
          <div className="flex flex-col p-3 justify-start gap-4">
            <h2>Message:</h2>
            <input
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Type your message here..."
              className="bg-slate-200 p-2 rounded-lg"
            />
            <div className="flex">
              <div>
                <div
                  className="rounded-[20px] bg-blue-500 w-fit px-4 py-2 cursor-pointer text-center text-white"
                  onClick={handleClick}
                >
                  Choose File
                </div>
                <input
                  onChange={handleFileChange}
                  className="hidden"
                  ref={inputRef}
                  type="file"
                />
              </div>
              <div className="flex justify-center items-center ml-4">
                {file && <h2>{file.name}</h2>}
              </div>
            </div>
            {file && (
              <button
                onClick={handleFileSubmit}
                className="rounded-[20px] bg-blue-500 w-fit px-4 py-2 cursor-pointer text-center text-white"
              >
                Send
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
