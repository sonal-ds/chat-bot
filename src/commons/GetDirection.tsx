import { Link } from "@yext/pages/components";
import * as React from "react";
import {
  conversionDetailsDirection,
  googleApikey,
} from "../../../sites-global/global";
// type Cta = {
//   buttonText: string;
//   address: object;
//   latitude?: number;
//   longitude?: number;
//   googlePlaceId?: any;
// };

interface GetDirectionProps {
  buttonText: string;
  address: {
    city?: string;
    region?: string;
    countryCode: string;
  };
  googlePlaceId?: string;
  latitude?: number;
  longitude?: number;
}
const GetDirection = (props: GetDirectionProps) => {
  const { buttonText, googlePlaceId } = props;

  const getDirectionUrl = () => {
    let destination = "";
    if (typeof googlePlaceId != "undefined" && googlePlaceId) {
      destination = googlePlaceId;
    }
    const getDirectionUrl =
      "https://maps.googleapis.com/maps/api/place/details/json?placeid=" +
      destination +
      "&key=" +
      googleApikey;
    window.open(getDirectionUrl, "_blank");
  };
  const conversionDetails_direction = conversionDetailsDirection;

  return (
    <Link
      data-ya-track="getdirections"
      eventName={`getdirections`}
      className="btn-primary"
      onClick={getDirectionUrl}
      href="javascript:void(0);"
      rel="noopener noreferrer"
      conversionDetails={conversionDetails_direction}
    >
      {buttonText}
    </Link>
  );
};

export default GetDirection;
