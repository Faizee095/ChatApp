import axios from "axios";

export const getChat = async (authObject) => {
  const resp = await axios.get("https://api.chatengine.io/chats", {
    headers: authObject,
  });
  return resp
};

export const createUser = async (payload) => {
  const privateKey = "5c46fa53-a49f-429f-9779-65f6aecf6a16";

  const resp = await axios.post("https://api.chatengine.io/users/", payload, {
    headers: { "PRIVATE-KEY": privateKey },
  });
  return resp;
};
