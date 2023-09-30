import React, { useState } from "react";

const CreateSqueal: React.FC = () => {
  const [checkbox, setCheckbox] = useState(true);
  const [timed, setTimed] = useState(false);
  const [geo, setGeo] = useState(false);
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
          <div>
            <label htmlFor="lat">Latitude</label>
            <input type="text" placeholder="Latitude" id="lat"></input>
            <label htmlFor="lng">Longitude</label>
            <input type="text" placeholder="Longitude" id="lng"></input>
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
          required
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
          required
        />
      </div>
      <button
        type="submit"
        className="btn-orange bg-grey text-white px-4 py-2 rounded"
        onClick={() => {
          const body: string = (
            document.getElementById("body") as HTMLInputElement
          ).value;
          const recipients: string = (
            document.getElementById("recipients") as HTMLInputElement
          ).value;
          const type = (document.querySelector(
            'input[name="type"]:checked'
          ) as HTMLInputElement)!.value;
          console.log(body, recipients, type);
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default CreateSqueal;
