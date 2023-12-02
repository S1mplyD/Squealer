import { Analytic } from "../utils/types.ts";
import { imagetypes, videotypes } from "../../../backend/util/constants.ts";

interface analyticProps {
  analytic: Analytic;
}

export default function Analytic({ analytic }: analyticProps) {
  const getFileType = (filename: string) => {
    for (let i of imagetypes) {
      if (filename.includes(i)) {
        return "image";
      }
    }
    for (let i of videotypes) {
      if (filename.includes(i)) {
        return "video";
      }
    }
    return undefined;
  };

  if (analytic.type === "text") {
    return (
      <div>
        <div>{analytic.body}</div>
        <div>{analytic.date.toISOString()}</div>
        <div>{analytic.negativeReactions}</div>
        <div>{analytic.positiveReactions}</div>
        <div>{analytic.visuals}</div>
      </div>
    );
  } else if (analytic.type === "geo") {
    return <div>{/* google maps */}</div>;
  } else if (analytic.type === "media") {
    const mediaType = getFileType(analytic.body);
    if (mediaType && mediaType === "image") {
      return (
        <div>
          <img src={analytic.body} alt={"image"} />
        </div>
      );
    } else if (mediaType && mediaType === "video") {
      return (
        <div>
          <iframe src={analytic.body}></iframe>
        </div>
      );
    }
  } else return <div></div>;
}
