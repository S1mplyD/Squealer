import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Squeal } from "../utils/types";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

export default function Analytic(props: {
  squeal: { originalSqueal: Squeal; responses: Squeal[] };
}) {
  L.Marker.prototype.options.icon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [11, 40],
  });
  const [showResponses, setShowResponses] = useState(false);
  return (
    <div className="bg-orange rounded-lg flex flex-col m-4 p-4">
      <div className="bg-grey rounded-lg p-4 m-4">
        <div className="text-white font-bold">
          Author:
          {props.squeal.originalSqueal.author}
        </div>
        {props.squeal.originalSqueal.type === "text" ? (
          <div className="text-white">{props.squeal.originalSqueal.body}</div>
        ) : props.squeal.originalSqueal.type === "media" ? (
          <img
            src={"/" + props.squeal.originalSqueal.body}
            className="w-1/2 h-1/2"
          ></img>
        ) : props.squeal.originalSqueal.type === "geo" ? (
          <div id={"map"}>
            <MapContainer
              center={{
                lat: +props.squeal.originalSqueal.lat!,
                lng: +props.squeal.originalSqueal.lng!,
              }}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "500px", width: "50%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={{
                  lat: +props.squeal.originalSqueal.lat!,
                  lng: +props.squeal.originalSqueal.lng!,
                }}
              >
                <Popup>{props.squeal.originalSqueal.locationName}</Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : null}
        <div className="text-white font-bold">
          Positive reactions{" "}
          {props.squeal.originalSqueal.positiveReactions?.length}
        </div>
        <div className="text-white font-bold">
          Negative Reactions{" "}
          {props.squeal.originalSqueal.negativeReactions?.length}
        </div>
      </div>
      {props.squeal.responses.length > 0 ? (
        <button
          className="bg-grey rounded-lg p-2"
          onClick={() => {
            setShowResponses(!showResponses);
          }}
        >
          Show Responses
        </button>
      ) : null}
      {showResponses ? (
        <div>
          {props.squeal.responses.map((el, index) => (
            <div key={index} className="text-white font-bold">
              {el.author}
              {el.type === "text" ? (
                <div key={index} className="text-white">
                  {el.body}
                </div>
              ) : el.type === "media" ? (
                <img key={index} src={el.body}></img>
              ) : el.type === "geo" ? (
                <div key={index}>map</div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
