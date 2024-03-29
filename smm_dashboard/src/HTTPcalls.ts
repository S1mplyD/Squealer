import axios from "axios";
import { Squeal, User } from "./utils/types";

const path: string = "";

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
  const users = await axios.get(`${path}/api/analytics/responses/${username}`);
  return users.data;
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

export async function getAllUserChannels() {
  const response = await axios.get(`${path}/api/channels/userchannel`);
  console.log(response.data);
  return response.data;
}

export async function getOfficialChannels() {
  const response = await axios.get(`${path}/api/channels/official`);
  return response.data;
}

export async function getAllKeywordChannels() {
  const response = await axios.get(`${path}/api/channels/keyword`);
  return response.data;
}

export async function getAllMentionsChannel() {
  const response = await axios.get(`${path}/api/channels/mention`);
  return response.data;
}

export const getAllPopularSqueals = async (username: string) => {
  const response = await axios.get(`${path}/api/analytics/popular/${username}`);
  return response.data;
};

export const getAllUnpopularSqueals = async (username: string) => {
  const response = await axios.get(
    `${path}/api/analytics/unpopular/${username}`,
  );
  return response.data;
};

export const getAllControversialSqueals = async (username: string) => {
  const response = await axios.get(
    `${path}/api/analytics/controversial/${username}`,
  );
  return response.data;
};

export const buyCharactersForUser = async (
  username: string,
  daily: number,
  weekly: number,
  monthly: number,
) => {
  const body = {
    dailyCharacters: daily,
    weeklyCharacters: weekly,
    monthlyCharacters: monthly,
  };
  const response = await axios.post(
    `${path}/api/users/user/${username}/buycharacters`,
    body,
  );
  return response;
};
