import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet-geosearch/dist/geosearch.css";

// @ts-ignore
export const SearchField = ({ changeLocation }) => {
  const provider = new OpenStreetMapProvider();

  // @ts-ignore
  const searchControl = new GeoSearchControl({
    provider: provider,
    showMarker: false,
  });

  const handleLoc = (result: any) => {
    changeLocation(result.location.y, result.location.x);
  };

  const map = useMap();
  // @ts-ignore
  useEffect(() => {
    map.addControl(searchControl);
    map.on("geosearch/showlocation", handleLoc);
    return () => {
      map.removeControl(searchControl);
    };
  }, [map, searchControl]);

  return null;
};
