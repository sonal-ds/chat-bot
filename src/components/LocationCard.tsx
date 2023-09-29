import * as React from "react";
import { CardComponent } from "@yext/search-ui-react";
import { Location } from "../types/search/locations";

import Address from "../commons/Address";
import { StaticData } from "../../sites-global/staticData";
import { Link } from "@yext/pages/components";
import { unitOfOneMile } from "../../sites-global/global";

const metersToMiles = (meters: number) => {
  // 1 mile is approximately 1609.34 meters
  const miles = meters * (1 / unitOfOneMile);

  return miles.toFixed(2);
};

/** Component on location card */
const LocationCard: CardComponent<Location> | string = ({ result }) => {
  const { name, address, slug, geomodifier } = result?.rawData;
  let formattedName = name?.replaceAll(" ", "-");

  let url = "";

  if (!slug) {
    url = `/${result.rawData.id}-${formattedName}.html`;
  } else {
    url = `/${slug?.toString()}.html`;
  }

  let locationTitle = "";
  if (geomodifier) {
    locationTitle += geomodifier;
  } else {
    locationTitle += address?.city + " " + address?.region;
  }

  return (
    <li
      className={`result-list-item result-list-inner-${result.index} result`}
      id={`result-${result.index}`}
    >
      <article className="location-content">
        <div className="location-left-col">
          <div className="location-name">
            <h3>
              <Link eventName={locationTitle} href={url}>
                {locationTitle}
              </Link>
            </h3>
            {typeof result.distance != "undefined" ? (
              <div className="miles">
                {metersToMiles(result.distance)} <span>{StaticData.miles}</span>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="location-address">
            <Address address={address} />
          </div>
        </div>
        <div className="location-right-col">
          {typeof result.distance != "undefined" ? (
            <div className="miles">
              {metersToMiles(result.distance)} <span>{StaticData.miles}</span>
            </div>
          ) : (
            ""
          )}
          <div className="location-cta">
            <Link eventName={name} href={url} className="btn-primary">
              go to store
            </Link>
          </div>
        </div>
        <div className="location-cta-mobile">
          <Link eventName={name} href={url} className="btn-primary">
            go to store
          </Link>
        </div>
      </article>
    </li>
  );
};
export default LocationCard;
