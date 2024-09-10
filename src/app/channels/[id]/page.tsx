"use client";
import axios from "axios";
import { fetchChannels, sendFile } from "@/lib/api";
import {
  useRef,
  MouseEvent,
  useState,
  useEffect,
  MouseEventHandler,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TiAttachment } from "react-icons/ti";
import { BsSend } from "react-icons/bs";
import { GoMention } from "react-icons/go";

interface Member {
  id: string;
  name: string;
}

interface Channel {
  id: string;
  name: string;
  is_private: boolean;
  num_members: number;
  members: Member[];
}

interface Message {
  user_name: string;
  message: string;
  img: string;
  file: string | null;
}

interface Member {
  id: string;
  name: string;
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
  const [channels, setChannels] = useState<Channel[] | undefined>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);

  const [isMention, setIsMention] = useState(false);

  const [selectedchannels, setSelectedChannels] = useState<
    Channel[] | undefined
  >([]);

  const handleClick = (event: MouseEvent<SVGElement>) => {
    event.preventDefault();
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleMention = () => {
    setIsMention(!isMention);
  };
  const handleAddMention: MouseEventHandler<HTMLDivElement> = (event) => {
    const data = (event.currentTarget as HTMLDivElement).dataset.mention;
    if (data) {
      setMessage(`${message} @${data}`);
      setIsMention(false);
    }
  };

  const fetchMessage = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/message/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      const Msg = response.data.messages
        .map((data: any) => {
          if (data.app_id && !data.files) {
            return {
              user_name: data.bot_profile.name,
              message: data.text,
              img: data.bot_profile.icons.image_36,
            };
          } else if (data.files) {
            return {
              user_name: data.app_id,
              message: data.text,
              img: data.bot_id,
              file: data.files[0].url_private,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      console.log("CHECK", Msg);
      setMessageHistory(Msg);
      // setChannels(response.data);
      // const newchannel = response?.data.filter(
      //   (channel: Channel) => channel.id === id
      // );
      // setSelectedChannels(newchannel);
      // newchannel && newchannel.length > 0;
      // setMembers(newchannel[0].members);
      // console.log("Printing", newchannel[0].members);
      // return response;
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (data: FormData) => {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/message/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  };

  const handleFileSubmit = async () => {
    if (!file) {
      const formData = new FormData();
      formData.append("message", message);
      try {
        const response = await sendMessage(formData);
        console.log(response);
        console.log("Message sent successfully", response);
        setFile(null);
        setMessage("");
        alert("Message sent successfully");
      } catch (error) {
        console.error("Error sending messsage:", error);
        alert("Error sending messsage");
      }
    } else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("message", message);
      formData.append("channel_id", id);

      try {
        const response = await sendFile(formData);
        console.log("Upload successful", response);
        setFile(null);
        setMessage("");
        alert("Upload successful");
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file");
      }
    }
  };

  useEffect(() => {
    console.log("use effect");
    const fetchData = async () => {
      try {
        const response = await fetchChannels();
        setChannels(response.data);
        const newchannel = response?.data.filter(
          (channel: Channel) => channel.id === id
        );
        setSelectedChannels(newchannel);
        newchannel && newchannel.length > 0;
        setMembers(newchannel[0].members);
        console.log("Printing", newchannel[0].members);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    fetchMessage();
  }, []);

  return (
    <main className="flex max-h-screen w-screen bg-fuchsia-50  rounded-xl justify-start">
      <div className="flex justify-start rounded-xl">
        <div className="bg-gray-200 w-[350px] min-h-screen rounded-l-xl p-5">
          <h1 className="text-black text-xl">Channels</h1>
          <hr className="border-black" />

          <div className="flex flex-col">
            {channels?.map((data) => (
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
      </div>

      <div className="flex flex-col bg-gray-50 w-full">
        {selectedchannels?.map((channel, index) => {
          return (
            <>
              <div className="bg-gray-300 w-full rounded-r-xl gap-3 text-black flex  font-bold justify-start p-3">
                <h1># {channel.name}</h1>
                <h1>Members: {channel.num_members}</h1>
              </div>
              {isMention && (
                <div className="absolute bottom-8">
                  {members.map((mem) => {
                    return (
                      <div
                        onClick={handleAddMention}
                        data-mention={mem.name}
                        key={mem.id}
                        className="bg-black text-white p-2 w-40 rounded-xl hover:cursor-pointer"
                      >
                        <h1>{mem.name}</h1>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="w-full h-full max-h-full px-4 gap-2 flex flex-col justify-end  overflow-y-scroll">
                {messageHistory.map((data) => {
                  return data.file ? (
                    <>
                      <div
                        key={data.img}
                        className="bg-blue-500 p-2 rounded-md max-w-[60%] w-fit ml-auto "
                      >
                        {data.message} file:
                        <Link href={data.file}>{data.file}</Link>
                      </div>
                    </>
                  ) : (
                    <div
                      key={data.img}
                      className="bg-blue-500 p-2 rounded-md max-w-[60%] w-fit ml-auto break-words"
                    >
                      {data.message}
                    </div>
                  );
                })}
              </div>
              <div className="px-4 sticky bottom-0 py-1 w-full">
                <div className="bg-gray-500 rounded-md text-start text-white p-3 flex items-center gap-2">
                  <TiAttachment
                    className="hover:cursor-pointer"
                    onClick={handleClick}
                    size={20}
                  />
                  <input
                    onChange={handleFileChange}
                    className="hidden"
                    ref={inputRef}
                    type="file"
                  />
                  <div className="flex justify-center items-center ml-2">
                    {file && <h2>{file.name}</h2>}
                  </div>
                  <GoMention
                    className="hover:cursor-pointer"
                    onClick={handleMention}
                    size={20}
                  />
                  <input
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    placeholder="Type your message here or click @ to mention user"
                    className="bg-transparent outline-none flex-grow w-full"
                    type="text"
                  />
                  <BsSend
                    className="hover:cursor-pointer"
                    size={20}
                    onClick={handleFileSubmit}
                  />
                </div>
              </div>
            </>
          );
        })}
      </div>
    </main>
  );
}
