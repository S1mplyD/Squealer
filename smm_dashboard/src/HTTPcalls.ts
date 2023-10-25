import axios from "axios";
import { Squeal } from "./utils/types";
const path: string = "http://localhost:3000";

export async function postSqueal(
  body: string,
  category: string,
  channels: string[],
  username: string,
  type: string,
  lng?: string,
  lat?: string,
  time?: number,
  recipients?: string[]
) {
  const requestBody = {
    body: body,
    lat: lat,
    lng: lng,
    recipients: recipients,
    category: category,
    channels: channels,
    type: type,
    time: time,
  };
  const newSqueal = await axios.post<Squeal>(
    `${path}/api/squeals/smm/${username}`,
    requestBody
  );
  return newSqueal;
}

export async function getUser(username: string) {
  const user = await axios.get(path + `/api/users/user/${username}`);
  return user.data;
}

export async function getMe() {
  const user = await axios.get(path + "/api/users/me");
  return user.data;
}

export async function getManagedUsers(username: string) {
  const managedUsers = await axios.get(
    `${path}/api/users/managedUsers/${username}`
  );
  return managedUsers.data;
}

export async function logout() {
  await axios.post(`${path}/api/auth/logout`);
}
