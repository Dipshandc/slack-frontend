"use client";
import axios from "axios";
import { useRef, MouseEvent, useState, useEffect } from "react";
import { fetchChannels, sendFile } from "@/lib/api";

interface Member {
  id: string;
  name: string;
  real_name: string;
  email: string;
}

interface Channel {
  id: string;
  name: string;
  is_private: boolean;
  num_members: number;
  members: Member[];
}

export default function Channel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);

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
      const response = await sendFile(formData);
      console.log("Upload successful", response.data);
      alert("Upload successful");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  useEffect(() => {
    const data = async () => {
      try {
        const response = await fetchChannels();
        setChannels(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    data();
  }, []);

  return (
    <main className="flex max-h-screen flex-col justify-start">
      <section className="bg-fuchsia-50 rounded-xl  h-full">
        <div className="flex justify-start rounded-xl">
          <div className="bg-gray-200 w-[350px] min-h-screen rounded-l-xl p-5 justify-start">
            <h1 className="text-black text-xl">Channels</h1>
            <hr className=" border-black" />

            <div className="flex flex-col">
              {channels?.map((data, index) => {
                return (
                  <a href={`/channels/${data.id}`}>
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 border-b border  hover:bg-gray-300 m-1 rounded-md text-black"
                    >
                      {`# ${data.name}`}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
          <div className="bg-gray-50 w-full rounded-r-xl text-black text-center font-bold justify-center mt-auto mb-auto">
            {" "}
            Click channels to send file
          </div>
        </div>
      </section>
    </main>
  );
}
