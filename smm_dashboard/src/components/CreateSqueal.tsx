import React, { useEffect, useState } from "react";
import {
  getManagedUsers,
  getMe,
  getUser,
  postSqueal,
  reverseGeocode,
  uploadFile,
} from "../HTTPcalls";
import { User } from "../utils/types";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { SearchField } from "./SearchBox.tsx";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const CreateSqueal: React.FC = () => {
  // const [checkbox, setCheckbox] = useState(true);
  const [location, setLocation] = useState({
    lat: 44.1420926,
    lng: 11.1478767,
  });
  const [user, setUser] = useState<User>();
  const [locationName, setLocationName] = useState<string>(
    "Marzabotto, Bologna, Emilia-Romagna, Italy",
  );
  const [timed, setTimed] = useState(false);
  const [geo, setGeo] = useState(false);
  const [text, setText] = useState(true);
  const [media, setMedia] = useState(false);
  const [loading, setLoading] = useState(true);
  const [managedUsers, setManagedUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();

  const MapLoc = () => {
    useMapEvents({
      async click(e) {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        const reverseGeocodeResult = await reverseGeocode(
          e.latlng.lat,
          e.latlng.lng,
        );
        setLocationName(
          reverseGeocodeResult.features[0].properties.geocoding.label,
        );
      },
    });
    return null;
  };
  const changeLocation = async (lat: number, lng: number) => {
    setLocation({ lat: lat, lng: lng });
    const reverseGeocodeResult = await reverseGeocode(lat, lng);
    setLocationName(
      reverseGeocodeResult.features[0].properties.geocoding.label,
    );
  };
  L.Marker.prototype.options.icon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [11, 40],
  });

  const getChannelsFromBody = (body: string) => {
    const channels: string[] = [];
    body = body.replace(".", " ");
    body = body.replace(",", " ");
    body = body.replace(":", " ");
    body = body.replace(";", " ");
    const words: string[] = body.split(" ");
    for (const word of words) {
      if (word[0] === "@") channels.push(word);
      if (word[0] === "§") channels.push(word);
      if (word[0] === "#") channels.push(word);
    }
    return channels;
  };

  useEffect(() => {
    async function fetchData() {
      setTimed(false);
      if ("geolocation" in navigator) {
        //geolocazione disponibile
        navigator.geolocation.getCurrentPosition(async (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          // @ts-ignore
          const reverseGeocodeResult = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude,
          );
          setLocationName(
            reverseGeocodeResult.features[0].properties.geocoding.label,
          );
        });
      }
      const user: User = await getMe();
      setUser(user);
      const managed: User[] = await getManagedUsers(user.username);
      managed.push(user);
      setManagedUsers(managed);
      setSelectedUser(managed[0]);
    }

    fetchData().then(() => {
      setLoading(false);
    });
  }, []);

  const handleChange = async () => {
    const selectedValue = (document.getElementById("user") as HTMLSelectElement)
      .value;
    const selUser = await getUser(selectedValue);
    setSelectedUser(selUser);
  };

  if (!loading && user && user.plan === "professional") {
    return (
      <div className="container mx-auto mt-4 p-4 sm:px-6 lg:px-8 rounded-lg bg-orange ">
        <form className="mt-4">
          <div className="mb-4">
            {managedUsers.length > 0 ? (
              <div>
                <label htmlFor="user" className="font-bold">
                  User
                </label>
                <select id="user" onChange={handleChange}>
                  {managedUsers.map((el) => (
                    <option key={el.username}>{el.username}</option>
                  ))}
                </select>
              </div>
            ) : null}

            <label htmlFor="characters" className="font-bold">
              Characters
            </label>
            <div id="characters" className="flex flex-row ">
              <p className="mr-4">
                Daily Characters Left: {selectedUser?.dailyCharacters}
              </p>
              <p className="mr-4">
                Weekly Characters Left: {selectedUser?.weeklyCharacters}
              </p>
              <p className="mr-4">
                Monthly Characters Left: {selectedUser?.monthlyCharacters}
              </p>
            </div>
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
                    // setCheckbox(true);
                    setText(true);
                    setMedia(false);
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
                    // setCheckbox(false);
                    setMedia(true);
                    setText(false);
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
                    setMedia(false);
                    setText(false);
                    // setCheckbox(true);
                  }}
                ></input>
              </div>
            </div>
            {text ? (
              <div>
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
                  {/*<TextArea />*/}
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
              </div>
            ) : null}
            {media ? (
              <div>
                <div>
                  <div className="mb-4">
                    <label htmlFor="body" className="block mb-2 font-bold">
                      File
                    </label>
                    <input type={"file"} id={"file"} />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="recipients"
                      className="block mb-2 font-bold"
                    >
                      Recipients
                    </label>
                    <input
                      type="text"
                      id="recipients"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            ) : null}
            {geo ? (
              <div>
                <div id={"map"}>
                  <MapContainer
                    center={location}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{ height: "500px", width: "50%" }}
                  >
                    <MapLoc />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={location}>
                      <Popup>{locationName}</Popup>
                    </Marker>
                    <SearchField changeLocation={changeLocation} />
                  </MapContainer>
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
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="btn-orange bg-grey text-white px-4 py-2 rounded"
            onClick={async () => {
              const type = (document.querySelector(
                'input[name="type"]:checked',
              ) as HTMLInputElement)!.value;
              if (type === "text") {
                const body: string = (
                  document.getElementById("body") as HTMLInputElement
                ).value;
                const recipients: string = (
                  document.getElementById("recipients") as HTMLInputElement
                ).value.replaceAll(" ", "");
                let recipientsArray: string[] = recipients.split(",");
                recipientsArray = recipientsArray.filter((el) => {
                  return el !== "";
                });
                const user = document.getElementById(
                  "user",
                ) as HTMLSelectElement;
                const channels = getChannelsFromBody(body);
                const newSqueal = await postSqueal(
                  recipientsArray.length > 0 ? "private" : "public",
                  channels,
                  user.options[user.selectedIndex].text,
                  type,
                  body,
                  geo ? location.lat.toString() : undefined,
                  geo ? location.lng.toString() : undefined,
                  geo ? locationName : undefined,
                  timed
                    ? +(document.getElementById("time") as HTMLInputElement)
                        .value
                    : undefined,
                  recipientsArray,
                );
                if (newSqueal) {
                  console.log(newSqueal);
                  alert("squeal posted correctly");
                  window.location.reload();
                }
              } else if (type === "media") {
                const files = document.querySelector(
                  "#file",
                ) as HTMLInputElement;
                if (files.files && files.files.length > 0) {
                  const file = files.files[0];
                  const filename = await uploadFile(file);
                  const recipients: string = (
                    document.getElementById("recipients") as HTMLInputElement
                  ).value.replaceAll(" ", "");
                  let recipientsArray: string[] = recipients.split(",");
                  recipientsArray = recipientsArray.filter((el) => {
                    return el !== "";
                  });
                  const user = document.getElementById(
                    "user",
                  ) as HTMLSelectElement;
                  const newSqueal = await postSqueal(
                    recipientsArray.length > 0 ? "private" : "public",
                    [],
                    user.options[user.selectedIndex].text,
                    type,
                    filename,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    recipientsArray,
                  );
                  if (newSqueal) {
                    alert("squeal posted correctly");
                    window.location.reload();
                  }
                }
              } else if (type === "geo") {
                const recipients: string = (
                  document.getElementById("recipients") as HTMLInputElement
                ).value.replaceAll(" ", "");
                let recipientsArray: string[] = recipients.split(",");
                recipientsArray = recipientsArray.filter((el) => {
                  return el !== "";
                });
                const user = document.getElementById(
                  "user",
                ) as HTMLSelectElement;
                const newSqueal = await postSqueal(
                  recipientsArray.length > 0 ? "private" : "public",
                  [],
                  user.options[user.selectedIndex].text,
                  type,
                  undefined,
                  location.lng + "",
                  location.lat + "",
                  locationName,
                  undefined,
                  recipientsArray,
                );
                if (newSqueal) {
                  alert("squeal posted correctly");
                  window.location.reload();
                }
              }
            }}
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
};

export default CreateSqueal;
