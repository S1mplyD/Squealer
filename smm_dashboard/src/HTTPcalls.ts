import axios from "axios";
import { Squeal, User } from "./utils/types";
const path: string = "http://localhost:3000";

export async function postSqueal(
  category: string,
  channels: string[],
  username: string,
  type: string,
  body?: string,
  lng?: string,
  lat?: string,
  locationName?: string,
  time?: number,
  recipients?: string[],
) {
  const requestBody = {
    body: body,
    lat: lat,
    lng: lng,
    locationName: locationName,
    recipients: recipients,
    category: category,
    channels: channels,
    type: type,
    time: time,
  };
  console.log(requestBody);
  const newSqueal = await axios.post<Squeal>(
    `${path}/api/squeals/smm/${username}`,
    requestBody,
  );
  return newSqueal;
}

export async function getUser(username: string) {
  const user = await axios.get(path + `/api/users/user/${username}`);
  return user.data;
}

export async function getMe() {
  const user = await axios.get<User>(path + "/api/users/me");
  return user.data;
}

export async function getManagedUsers(username: string) {
  const managedUsers = await axios.get(
    `${path}/api/users/managedUsers/${username}`,
  );
  return managedUsers.data;
}

export async function logout() {
  await axios.post(`${path}/api/auth/logout`);
}

export async function login(mail: string, password: string) {
  await axios.post(`${path}/api/auth/login`, {
    username: mail,
    password: password,
  });
}

export async function getSMM(username: string) {
  const user = await axios.get<User>(`${path}/api/users/user/${username}`);
  return user.data;
}

export async function addSMM(username: string) {
  const status = await axios.post(`${path}/api/users/user/${username}/smm`);
  return status.status;
}

export async function removeSMM(username: string) {
  const status = await axios.delete(`${path}/api/users/user/${username}/smm`);
  return status.status;
}

export async function getProUsers() {
  const users = await axios.get(`${path}/api/users/professionals`);
  if (users.status == 200) return users.data;
  else return undefined;
}

export async function getAllUserSqueal(username: string) {
  const users = await axios.get(`${path}/api/squeals/user/${username}`);
  return users.data;
}

export async function getAllUserAnalytics(username: string) {
  const response = await axios.get(`${path}/api/analytics/${username}`);
  if (response.status === 200) {
    return response.data;
  }
}

export async function reverseGeocode(lat: number, lng: number) {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?format=geocodejson&lat=${lat}&lon=${lng}`,
  );
  return response.data;
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${path}/api/media`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
