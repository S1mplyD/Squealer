import axios from "axios";
import { Squeal } from "./utils/types";

export async function addNewSqueal(
  body: string,
  category: string,
  channels: string[],
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
  const newSqueal = await axios.post<Squeal>("/api/squeals/type", requestBody);
  return newSqueal;
}
