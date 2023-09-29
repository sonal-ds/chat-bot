import * as React from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { useSearchState } from "@yext/search-headless-react";
import { getUserLocation } from "@yext/search-ui-react";
import defaultMarker from "../assets/images/blue-pin-1.png";
import selectedMarker from "../assets/images/black-pin-1.png";

export const GoogleMaps = () => {
  const [activeMarker, setActiveMarker] = React.useState(null);

  const [userMap, setUserMap] = React.useState<google.maps.Map>();
  const [changeMapIcon, setChangeMapIcon] = React.useState(null);
  const locationResults =
    useSearchState((state) => state.vertical?.results) || [];

  const defaultMarkerIcon = {
    url: defaultMarker,

    scale: 1.1,
    fillOpacity: 1,
    strokeWeight: 1,
    labelOrigin: new google.maps.Point(14, 15),
    size: new google.maps.Size(28, 48),
  };
  const selectedMarkerIcon = {
    url: selectedMarker,

    scale: 1.1,
    fillOpacity: 1,

    strokeWeight: 1,

    labelOrigin: new google.maps.Point(17, 18),
    size: new google.maps.Size(34, 58),
  };

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const handleOnLoad = (map) => {


    getUserLocation()
      .then((data) => {
        map.setCenter({
          lat: data.coords.latitude,
          lng: data.coords.longitude,
        });
        
      })
      .catch((error) => {
        console.log("Error", error);
      });
    setUserMap(map);
  };

  const fitBounds = () => {
    const bounds = new window.google.maps.LatLngBounds();
    locationResults.map((location) => {
      bounds.extend({
        lat: location?.rawData?.yextDisplayCoordinate?.latitude,
        lng: location?.rawData?.yextDisplayCoordinate?.longitude,
      });
      return;
    });
    if (userMap) {
      userMap?.fitBounds(bounds);
    }
  };

  React.useEffect(() => {
    fitBounds();
  }, [locationResults]);

  return (
    <GoogleMap
      onLoad={handleOnLoad}
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={{ width: "100vw", height: "100vh" }}
    >
      {locationResults &&
        locationResults.map(({ id, name, rawData }, index: number) => (
          <Marker
            label={{
              text: String.fromCharCode(index + 64).toUpperCase(),
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: "14px",
            }}
            // label={(index + 1).toString()}
            key={id}
            icon={changeMapIcon === id ? selectedMarkerIcon : defaultMarkerIcon}
            position={{
              lat: rawData?.yextDisplayCoordinate?.latitude,
              lng: rawData?.yextDisplayCoordinate?.longitude,
            }}
            onClick={() => {
              setChangeMapIcon(id);
              handleActiveMarker(id);
            }}
          >
            {activeMarker === id ? (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div>{name}</div>
              </InfoWindow>
            ) : null}
          </Marker>
        ))}
    </GoogleMap>
  );
};

/** Initialize Scroller */
export function scrollToRow(rowIndex: number) {
  const resultElements: HTMLElement[] = Array.from(
    document.querySelectorAll(".result")
  );
  const firstResultElement = resultElements[0];
  const targetResultElement = resultElements[rowIndex];

  const targetPosition =
    targetResultElement?.offsetTop - firstResultElement?.offsetTop;

  Array.from(document.querySelectorAll(".scrollbar-container")).forEach(
    (scrollContainer: Element) => {
      (scrollContainer as HTMLElement).scrollTop = targetPosition;
    }
  );
}
