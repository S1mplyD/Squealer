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
  for (let i of response.data.elements.members) {
    const node = await getNode(i.ref);
    nodes.push({ name: node.name, lat: node.lat, lng: node.lng });
  }
  return {
    name: `#${response.data.elements.tags.ref}-${response.data.elements.tags.from}->${response.data.elements.tags.to}`,
    nodes: nodes,
  };
};

const getNode = async (id: string) => {
  const response = await axios.get(
    `https://api.openstreetmap.org/api/0.6/node/${id}.json`,
  );

  return {
    name: response.data.elements.tags.name,
    lat: response.data.elements.lat,
    lng: response.data.elements.lon,
  };
};

const postRouteSqueal = async (routeSqueal: RouteSqueal) => {
  const route = await getRoute(routeSqueal.reference);
  for (let i of route.nodes) {
    setTimeout(async () => {
      await squealModel.create({
        lat: i.lat + "",
        lng: i.lng + "",
        locationName: i.name,
        channels: [`§${route.name}`],
        author: "Squealer",
        date: Date.now(),
        category: "public",
        type: "geo",
        originalSqueal: "",
      });
    }, routeSqueal.timeBetween);
  }
};

export const postRouteSqueals = async () => {
  const routeSqueals: RouteSqueal[] = await squealRouteModel.find({});
  for (let i of routeSqueals) {
    await postRouteSqueal(i);
  }
};
