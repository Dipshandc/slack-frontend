"use client"; // Make this component client-side

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {sendAccessToken} from "@/lib/api";

interface AccessPageProps {
  searchParams: {
    code?: string;
    state?: string;
  };
}

const AccessPage: React.FC<AccessPageProps> = ({ searchParams }) => {
  const code = searchParams.code;

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    console.log("client", clientId);
    const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
    console.log("clientSecret", clientSecret);
    const authorizationCode = code;
    const redirectUri = "https://slack-frontend-iota.vercel.app/access/";

    const exchangeCodeForToken = async () => {
      try {
        const response = await axios.post(
          "https://slack.com/api/oauth.v2.access",
          null,
          {
            params: {
              client_id: clientId,
              client_secret: clientSecret,
              code: authorizationCode,
              redirect_uri: redirectUri,
            },
          }
        );

        if (response.data.ok) {
          const accessToken = response.data.access_token;
          console.log(response);
          console.log("Access Token:", accessToken);
          try{
            const response = await sendAccessToken(accessToken);
            console.log(response)
            alert(response.data)
          }
          catch(error){
            console.log("Error sending access token to backend",error)
          }

        } else {
          console.error("Error:", response.data.error);
        }
      } catch (error) {
        console.error("Request failed:", error);
      }
    };

    if (authorizationCode) {
      console.log(authorizationCode);
      exchangeCodeForToken();
    }
  }, [code]);

  return (
    <div>
      <Link href="/channels">Go to see channels</Link>
    </div>
  );
};

export default AccessPage;
