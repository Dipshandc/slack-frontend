"use client";
import axios from "axios";
import { useRef, MouseEvent, useState, useEffect } from "react";
import { fetchChannels, sendFile } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function ChannelId({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedchannels, setSelectedChannels] = useState<Channel[]>([]);

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
    const fetchData = async () => {
      try {
        const response = await fetchChannels();
        setChannels(response.data);
        setSelectedChannels(
          response.data.filter((channel: Channel) => channel.id === id)
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="flex max-h-screen w-full justify-start">
      <section className="bg-fuchsia-50 rounded-xl h-full">
        <>
          <div className="flex justify-start rounded-xl">
            <div className="bg-gray-200 w-[350px] min-h-screen rounded-l-xl p-5">
              <h1 className="text-black text-xl">Channels</h1>
              <hr className="border-black" />

              <div className="flex flex-col">
                {channels.map((data) => (
                  <Link key={data.id} href={`/channels/${data.id}`}>
                    <div
                      className={`flex justify-between items-center p-2 border-b border hover:bg-gray-300 m-1 rounded-md text-black ${
                        id === data.id
                          ? "bg-gray-500 text-white hover:bg-gray-500"
                          : ""
                      }`}
                    >
                      {`# ${data.name}`}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col bg-gray-700 w-full ">
            {selectedchannels.map((channel, index) => {
              return (
                <>
                    <div className="bg-gray-50 w-full rounded-r-xl gap-3 text-black flex  font-bold justify-start p-3">
                      <h1># {channel.name}</h1>
                      <h1>Members:{channel.num_members}</h1>
                    </div>
                    <input
                      placeholder="Type your message here or @ to mention"
                      className="bg-black rounded-md text-start text-white  p-3 "
                      type="text"
                    />
                </>
              );
            })}
            </div>
          </div>
        </>
      </section>
    </main>
  );
}
