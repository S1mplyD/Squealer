import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet-geosearch/dist/geosearch.css";

export const SearchField = () => {
  const provider = new OpenStreetMapProvider();

  // @ts-ignore
  const searchControl = new GeoSearchControl({
    provider: provider,
  });

  const map = useMap();
  // @ts-ignore
  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map, searchControl]);

  return null;
};
