"use client"; // Make this component client-side

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SendFile({ params }: { params: { code: string } }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const authorizationCode = code;
    const redirectUri = "https://slack-frontend-iota.vercel.app/";

    const exchangeCodeForToken = async () => {
      try {
        console.log("check");
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
          console.log(response);
          setAccessToken(response.data.access_token);
          localStorage.setItem("accessToken", response.data.access_token);
          console.log("Access Token:", response.data.access_token);
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
  }, [params.code]);

  return (
    <div>
      <Link href="/channels">Go to see channels</Link>
    </div>
  );
}
