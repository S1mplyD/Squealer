import axios from "axios";
import { RouteSqueal } from "../util/types";
import squealModel from "../database/models/squeals.model";
import squealRouteModel from "../database/models/squealRoute.model";

const getRoute = async (id: string) => {
  const response = await axios.get(
    `https://api.openstreetmap.org/api/0.6/relation/${id}.json`,
  );
  let nodes: { name: string; lat: number; lng: number }[] = [];
  // waypoint
  for (let i of response.data.elements[0].members) {
    if (i.role === "stop") {
      const node = await getNode(i.ref);
      nodes.push({ name: node.name, lat: node.lat, lng: node.lng });
    }
  }
  return {
    name: `#${response.data.elements[0].tags.ref.replaceAll(
      " ",
      "_",
    )}-${response.data.elements[0].tags.from.replaceAll(
      " ",
      "_",
    )}->${response.data.elements[0].tags.to.replaceAll(" ", "_")}`,
    nodes: nodes,
  };
};

const getNode = async (id: string) => {
  const response = await axios.get(
    `https://api.openstreetmap.org/api/0.6/node/${id}.json`,
  );

  return {
    name: response.data.elements[0].tags.name,
    lat: response.data.elements[0].lat,
    lng: response.data.elements[0].lon,
  };
};

const postRouteSqueal = async (routeSqueal: RouteSqueal) => {
  const route = await getRoute(routeSqueal.reference);

  await route.nodes.reduce(async (previousPromise, node) => {
    await previousPromise;

    await doSetTimeout(route.name, node, routeSqueal.timeBetween);
  }, Promise.resolve());
};

const doSetTimeout = async (
  channelName: string,
  i: { name: string; lat: number; lng: number },
  time: number,
): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(async () => {
      await squealModel.create({
        lat: i.lat + "",
        lng: i.lng + "",
        locationName: i.name,
        channels: [`${channelName}`],
        author: "Squealer",
        date: Date.now(),
        category: "public",
        type: "geo",
        originalSqueal: "",
      });

      resolve();
    }, time);
  });
};

export const postRouteSqueals = async () => {
  const routeSqueals: RouteSqueal[] = await squealRouteModel.find({});
  for (let i of routeSqueals) {
    await postRouteSqueal(i);
  }
};
