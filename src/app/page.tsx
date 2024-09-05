"use client";
import axios from "axios";
import {
  useRef,
  ChangeEvent,
  useState,
  useEffect,
  ChangeEventHandler,
} from "react";
import { fetchChannels, sendFile } from "@/lib/api";
import Link from "next/link";

export default function Home() {
  const [code, setCode] = useState<string>("");

  const handleCode: ChangeEventHandler<HTMLInputElement> = (event) => {
    setCode(event.target.value);
  };

  return (
    <main className="flex max-h-screen justify-center gap-4">
        <a href="https://slack.com/oauth/v2/authorize?client_id=7675090647713.7672722744069&scope=channels:read,chat:write,chat:write.public,files:write,groups:read,team:read,users:read.email,users:read&user_scope=">
          <img
            alt="Add to Slack"
            height="40"
            width="139"
            src="https://platform.slack-edge.com/img/add_to_slack.png"
            srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
          />
        </a>
      <input
        onChange={handleCode}
        value={code}
        className="text-black p-2 rounded-xl mt-10"
        type="text"
        placeholder="Enter code to get access token"
        name="code"
        id="code"
      />
      <Link className="p-2 mt-10" href={`http://localhost:3000/access/${code}`}>
        Get access token
      </Link>
    </main>
  );
}
