import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

import L from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

interface routingProps {
  start: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

export const Routing = ({ start, destination }: routingProps) => {
  const map = useMap();
  // @ts-ignore
  useEffect(() => {
    if (!map) return;
    const routingControl = L.routing
      .control({
        waypoints: [
          L.latLng(start.lat, start.lng),
          L.latLng(destination.lat, destination.lng),
        ],
        routeWhileDragging: true,
      })
      .addTo(map);
    return () => map.removeControl(routingControl);
  }, [map]);
  return null;
};
