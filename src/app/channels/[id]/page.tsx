"use client";
import axios from "axios";
import { fetchChannels } from "@/lib/api";
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

export default function ChannelId({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [channels, setChannels] = useState<Channel[] | undefined>([]);
  const [members, setMembers] = useState<Member[]>([]);
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
    // If you need to pass data, you can store it as a data attribute on the element
    const data = (event.currentTarget as HTMLDivElement).dataset.mention;
    if (data) {
      setMessage(`${message} @${data}`);
      setIsMention(false);
    }
  };

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

  const fetchChannels = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const channelsUrl = "https://slack.com/api/conversations.list";
    const membersUrl = "https://slack.com/api/conversations.members";
    const userInfoUrl = "https://slack.com/api/users.info";

    try {
      // Fetch channels
      const channelsResponse = await fetch(channelsUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const channelsData = await channelsResponse.json();

      if (!channelsData.ok) {
        console.error("Error retrieving channels:", channelsData.error);
        return;
      }

      const formattedChannels: Channel[] = [];

      for (const channel of channelsData.channels) {
        const channelId = channel.id;
        const channelInfo: Channel = {
          id: channelId,
          name: channel.name,
          is_private: channel.is_private,
          num_members: channel.num_members,
          members: [],
        };

        // Fetch members of the channel
        const membersResponse = await fetch(
          `${membersUrl}?channel=${channelId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const membersData = await membersResponse.json();

        if (!membersData.ok) {
          console.error("Error retrieving members:", membersData.error);
          continue;
        }

        for (const userId of membersData.members) {
          // Fetch user info
          const userInfoResponse = await fetch(
            `${userInfoUrl}?user=${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const userInfoData = await userInfoResponse.json();

          if (userInfoData.ok) {
            channelInfo.members.push({
              id: userId,
              name: userInfoData.user.name,
            });
          } else {
            console.error("Error getting user info:", userInfoData.error);
          }
        }

        formattedChannels.push(channelInfo);
      }

      console.log("Formatted Channels:", formattedChannels);
      return formattedChannels as Channel[];
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const sendFile = async (data: any) => {
    const accessToken = localStorage.getItem("accessToken");
    const formData = data;
    try {
      const response: any = await fetch("https://slack.com/api/files.upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.ok) {
        console.log("File and message sent successfully");
      } else {
        console.error("Error sending file and message:", data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const handleFileSubmit = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", message);
    formData.append("channel_id", id);

    try {
      const response = await sendFile(formData);
      console.log("Upload successful", response);
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
        setChannels(response);
        const newchannel = response?.filter(
          (channel: Channel) => channel.id === id
        );
        if (newchannel && newchannel.length > 0) {
          setMembers(newchannel[0].members);
          console.log(newchannel[0].members);
        } else {
          setMembers([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  });

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
              {
                <div className="bg-black rounded-md text-start text-white p-3 mt-[585px] ml-3 mr-4 flex items-center gap-4">
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
                  <div className="flex justify-center items-center ml-4">
                    {file && <h2>{file.name}</h2>}
                  </div>
                  <GoMention
                    className="hover:cursor-pointer"
                    onClick={handleMention}
                  />
                  <input
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    placeholder="Type your message here or click @ to mention user"
                    className="bg-transparent outline-none w-full"
                    type="text"
                  />
                  <BsSend
                    className="hover:cursor-pointer"
                    size={20}
                    onClick={handleFileSubmit}
                  />
                </div>
              }
            </>
          );
        })}
      </div>
    </main>
  );
}
