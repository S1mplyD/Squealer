import React, { useEffect, useState } from "react";
import { getManagedUsers, getMe, postSqueal } from "../HTTPcalls";
import { User } from "../utils/types";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "react";
import "leaflet/dist/leaflet.css";
const CreateSqueal: React.FC = () => {
  const [checkbox, setCheckbox] = useState(true);
  const [location, setLocation] = useState({
    lat: 44.1420926,
    lng: 11.1478767,
  });
  const [timed, setTimed] = useState(false);
  const [geo, setGeo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [managedUsers, setManagedUsers] = useState<User[]>([]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      //geolocazione disponibile
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
    async function fetchData() {
      const user: User = await getMe();
      const managed: User[] = await getManagedUsers(user.username);
      setManagedUsers(managed);
    }

    fetchData().then(() => {
      setLoading(false);
    });
  }, []);

  if (!loading) {
    return (
      <div className="container mx-auto mt-4 p-4 sm:px-6 lg:px-8 rounded-lg bg-orange ">
        <form className="mt-4">
          <div className="mb-4">
            <label htmlFor="user" className="font-bold">
              User
            </label>
            {managedUsers.length > 0 ? (
              <div>
                <select id="user">
                  {managedUsers.map((el) => (
                    <option key={el.username}>{el.username}</option>
                  ))}
                </select>
              </div>
            ) : null}
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
                    <input
                      type="number"
                      name="time"
                      id="time"
                      placeholder="Time"
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
            {geo ? (
              <div>
                <div className="flex flex-row bg-grey rounded-lg p-4 my-4">
                  <button className="rounded-lg bg-orange text-black p-4">
                    Center
                  </button>
                </div>
                <div id={"map"}>
                  <MapContainer
                    center={[51.505, -0.09]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "300px", width: "50%" }}
                    className={""}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[51.505, -0.09]}>
                      <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            ) : (
              <>
                <p>not loaded</p>
              </>
            )}
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
            type="button"
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
                'input[name="type"]:checked',
              ) as HTMLInputElement)!.value;
              const user = document.getElementById("user") as HTMLSelectElement;
              const newSqueal = await postSqueal(
                body,
                category,
                channelsArray,
                user.options[user.selectedIndex].text,
                type,
                geo ? location.lat.toString() : undefined,
                geo ? location.lng.toString() : undefined,
                timed
                  ? +(document.getElementById("time") as HTMLInputElement).value
                  : undefined,
                recipientsArray,
              );
              console.log(newSqueal);
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
