import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import { postSqueal } from "../HTTPcalls";

const CreateSqueal: React.FC = () => {
  const [checkbox, setCheckbox] = useState(true);
  const [location, setLocation] = useState<LatLngTuple>([
    44.1420926, 11.1478767,
  ]);
  const [timed, setTimed] = useState(false);
  const [geo, setGeo] = useState(false);
  useEffect(() => {
    if ("geolocation" in navigator) {
      //geolocazione disponibile
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);
  const MapLoc = () => {
    useMapEvents({
      click(e) {
        setLocation([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };
  return (
    <form className="mt-4">
      <div className="mb-4">
        <label htmlFor="radiodiv" className="font-bold">
          Type
        </label>
        <div id="radiodiv" className="flex flex-row">
          <div className="mr-4">
            <label htmlFor="text">Text</label>
            <input
              type="radio"
              value={"text"}
              id="text"
              name="type"
              defaultChecked
              onClick={() => {
                setCheckbox(true);
                setGeo(false);
              }}
            ></input>
          </div>
          <div className="mr-4">
            <label htmlFor="media">Media</label>
            <input
              type="radio"
              value={"media"}
              id="media"
              name="type"
              onClick={() => {
                setCheckbox(false);
                setGeo(false);
              }}
            ></input>
          </div>
          <div className="mr-4">
            <label htmlFor="geo">Geo</label>
            <input
              type="radio"
              value={"geo"}
              id="geo"
              name="type"
              onClick={() => {
                setGeo(true);
                setCheckbox(true);
              }}
            ></input>
          </div>
        </div>
        {checkbox ? (
          <div>
            <label htmlFor="timed">Timed</label>
            <input
              type="checkbox"
              value={"timed"}
              id="timed"
              onClick={() => {
                setTimed(!timed);
              }}
            ></input>
            {timed ? (
              <div>
                <input type="number" name="time" id="time" placeholder="Time" />
              </div>
            ) : null}
          </div>
        ) : null}
        {geo ? (
          <div className="h-96">
            <MapContainer center={location} zoom={13} scrollWheelZoom={true}>
              <MapLoc />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={location}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : null}
      </div>
      <div className="mb-4">
        <label htmlFor="body" className="block mb-2 font-bold">
          Body
        </label>
        <textarea
          id="body"
          className="w-full px-3 py-2 border rounded"
          rows={4}
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="recipients" className="block mb-2 font-bold">
          Recipients
        </label>
        <input
          type="text"
          id="recipients"
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="channels" className="block mb-2 font-bold">
          Channels
        </label>
        <input
          type="text"
          id="channels"
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block mb-2 font-bold">
          Category
        </label>
        <input
          type="text"
          id="category"
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="btn-orange bg-grey text-white px-4 py-2 rounded"
        onClick={async () => {
          const body: string = (
            document.getElementById("body") as HTMLInputElement
          ).value;
          const category: string = (
            document.getElementById("category") as HTMLInputElement
          ).value;
          const channels: string = (
            document.getElementById("channels") as HTMLInputElement
          ).value.replaceAll(" ", "");
          const channelsArray: string[] = channels.split(",");
          const recipients: string = (
            document.getElementById("recipients") as HTMLInputElement
          ).value.replaceAll(" ", "");
          const recipientsArray: string[] = recipients.split(",");
          const type = (document.querySelector(
            'input[name="type"]:checked'
          ) as HTMLInputElement)!.value;
          const newSqueal = await postSqueal(
            body,
            category,
            channelsArray,
            type,
            location[0].toString(),
            location[1].toString(),
            timed
              ? +(document.getElementById("time") as HTMLInputElement).value
              : undefined,
            recipientsArray
          );
          console.log(newSqueal);
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default CreateSqueal;
