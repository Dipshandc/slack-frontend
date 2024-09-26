"use client"; // Make this component client-side

// this page is only for testing slack integration for development

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { sendAccessToken } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AccessPageProps {
  searchParams: {
    code?: string;
    state?: string;
  };
}

const AccessPage: React.FC<AccessPageProps> = ({ searchParams }) => {
  const router = useRouter();
  const code = searchParams.code;
  const tenant = searchParams.state;
  const [loader, setLoader] = useState<boolean>(true);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    console.log("client", clientId);
    const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
    const authorizationCode = code;
    console.log("clientSecret", clientSecret);
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
          router.replace(
            `http://${tenant}.localhost:3000/tools/ats/access/${accessToken}`
          );
        } else {
          console.error("Error:", response.data.error);
        }
      } catch (error) {
        console.error("Request failed:", error);
      } finally {
        router.replace(`http://${tenant}.localhost:3000/tools/ats/settings`);
      }
    };

    if (authorizationCode) {
      console.log(authorizationCode);
      exchangeCodeForToken();
    } else {
      router.replace(`http://${tenant}.localhost:3000/tools/ats/settings`);
    }
  }, [code]);

  return (
    <>
      {loader ? (
        <>
          <div className="mt-0 z-20 w-full top-0 rounded-lg">
            <div className="flex h-[20vh] w-full flex-col items-center justify-center">
              <div className="dot-spinner">
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
              </div>
              <span className="mt-5 text-xl font-semibold capitalize p-2 py-1 rounded">
                Loading...
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-0 z-20 w-full top-0 rounded-lg">
          <div className="flex h-[20vh] w-full flex-col items-center justify-center">
            <div className="dot-spinner">
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
              <div className="dot-spinner__dot"></div>
            </div>
            <span className="mt-5 text-xl font-semibold capitalize p-2 py-1 rounded">
              Loading...
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessPage;
