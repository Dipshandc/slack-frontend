"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex max-h-screen justify-center gap-4">
      <Link href="https://slack.com/oauth/v2/authorize?client_id=7675090647713.7672722744069&scope=channels:read,chat:write,chat:write.public,files:write,groups:read,team:read,users:read.email,users:read&user_scope=">
        <img
          alt="Add to Slack"
          height="40"
          width="139"
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        />
      </Link>
    </main>
  );
}
