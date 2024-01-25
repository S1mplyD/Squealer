import { Squeal } from "../utils/types";
import { useState } from "react";

export default function Analytic(props: {
  squeal: { originalSqueal: Squeal; responses: Squeal[] };
}) {
  const [showResponses, setShowResponses] = useState(false);
  return (
    <div className="bg-orange rounded-lg flex flex-col m-4 p-4">
      <div className="bg-grey rounded-lg p-4 m-4">
        <div className="text-white font-bold">
          {props.squeal.originalSqueal.author}
        </div>
        {props.squeal.originalSqueal.type === "text" ? (
          <div className="text-white">{props.squeal.originalSqueal.body}</div>
        ) : props.squeal.originalSqueal.type === "media" ? (
          <img src={props.squeal.originalSqueal.body}></img>
        ) : props.squeal.originalSqueal.type === "geo" ? (
          <>map</>
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
