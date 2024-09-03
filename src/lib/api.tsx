import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/";

export const fetchChannels = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/channels/`);
  return response;
};

export const sendFile = async (data: FormData) => {
  const response = await axios.post("http://127.0.0.1:8000/api/upload/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
