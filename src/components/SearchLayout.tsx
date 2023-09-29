// src/components/StoreLocator.tsx

import * as React from "react";
import {

 
  OnSelectParams,
  VerticalResults,

  getUserLocation,
} from "@yext/search-ui-react";
import {
  Matcher,
  SelectableStaticFilter,
  useSearchActions,
  useSearchState,
} from "@yext/search-headless-react";
// Mapbox CSS bundle
import "mapbox-gl/dist/mapbox-gl.css";
import { GoogleMaps } from "./GoogleMaps";
import { AnswerExperienceConfig, center_latitude, center_longitude, googleApikey } from "../../sites-global/global";
import { Wrapper } from "@googlemaps/react-wrapper";
import LocationCard from "./LocationCard";
import useFetchResults from "../hooks/useFetchResults";
import FilterSearch from "./FilterSearch";
import Geocode from "react-geocode";
import { SelectableFilter } from "@yext/answers-headless-react";

import useGetPostalCodeLatLng from "./useGetPostalCodeLatLng";

let mapzoom = 6;
const centerParams: { latitude: number; longitude: number } = {
  latitude: center_latitude,
  longitude: center_longitude,
};
type InitialSearchState = "not started" | "started" | "complete";

const searchLayout = (): JSX.Element => {
  const searchActions = useSearchActions();
  const locationResults = useFetchResults() || [];
  type FilterHandle = React.ElementRef<typeof FilterSearch>;
  const filterRef = React.useRef<FilterHandle>(null);
  const [startgeocode, setStartGeoCode] = React.useState(false);
  const [displaymsg, setDisplaymsg] = React.useState(false);
  const [inputvalue, setInputValue] = React.useState("");
  const [errorstatus, setErrorStatus] = React.useState(false);
  const [, setPostalLoading] = React.useState(false);
  const [checkallowed, setCheckAllowed] = React.useState(false);
  const { postalcode } = useGetPostalCodeLatLng();

  const [, setallowLocation] = React.useState("");
  const [searchString, setSearchString] = React.useState("Unites State");
  const [, setAllowResult] = React.useState(false);

  const [, setCheck] = React.useState(false);
  const [newparam, SetNewparam] = React.useState({ latitude: 0, longitude: 0 });
  let firstTimeRunners = true;
  const [initialSearchState, setInitialSearchState] =
    React.useState<InitialSearchState>("not started");
    const searchLoading = useSearchState((state) => state.searchStatus.isLoading);
    
    const onClick = () => {
      if (navigator.geolocation) {
        const error = (error: GeolocationPositionError) => {
          if (error.code === 1) {
            setallowLocation("Please allow your Location");
            setCheckAllowed(false);
          }
        };
        navigator.geolocation.getCurrentPosition(
          function (position: GeolocationPosition) {
            Geocode.setApiKey(googleApikey);
            Geocode.fromLatLng(
              position.coords.latitude,
              position.coords.longitude
            ).then(
              (response: any) => {
                if (response.results[0]) {
                  scrollToRow(0);
                  setSearchString("My Location");
                  filterRef.current &&
                    filterRef.current.setInputValue("My Location");
                  setallowLocation("");
                }
                setCheckAllowed(true);
                SetNewparam({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
                mapzoom = 4;
              },
              (error: Error) => {
                console.error(error);
                setCheck(false);
                setCheckAllowed(false);
              }
            );
  
            const params = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            const locationFilter: SelectableFilter = {
              selected: true,
              fieldId: "builtin.location",
              value: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                radius: AnswerExperienceConfig.locationRadius,
              },
              matcher: Matcher.Near,
            };
  
            mapzoom = 3;
            searchActions.setStaticFilters([locationFilter]);
            searchActions.setUserLocation(params);
            searchActions.executeVerticalQuery();
          },
          error,
          {
            timeout: 10000,
          }
        );
      }
    };
  
    /** Get parent Node */
  
    const handleInputValue = () => {
      setInputValue("");
    };
  
    /** Load data on first load */
    React.useEffect(() => {
      if (firstTimeRunners) {
        firstTimeRunners = false;
        // FirstLoad();
      }
    }, []);
  
    /**
     * Change marker position in case of user location allowed
     * @param address :address
     */
    function getCoordinates(address: any) {
      console.log("address", address);
      setSearchString(address);
      setCheck(true);
      filterRef.current?.setInputValue(address);
      postalcode(address, newparam, checkallowed);
    }

  return (
    <>
      <Wrapper
        apiKey={googleApikey}
        language={AnswerExperienceConfig.locale}
        libraries={["places", "geometry"]}
      >
      <div className="flex h-[calc(100vh-242px)] border">
        <div className="flex w-1/3 flex-col">
          <FilterSearch
           
              ref={filterRef}
              setSearchString={setSearchString}
              setCheckAllowed={setCheckAllowed}
              errorstatus={errorstatus}
              setErrorStatus={setErrorStatus}
              checkallowed={checkallowed}
              displaymsg={displaymsg}
              getCoordinates={getCoordinates}
              setPostalLoading={setPostalLoading}
              setDisplaymsg={setDisplaymsg}
              customCssClasses={{
                filterSearchContainer: "m-2 w-full",
                inputElement: "FilterSearchInput pr-[90px]",
                optionsContainer: "options",
              }}
              setAllowResult={setAllowResult}
              inputvalue={inputvalue}
              setSearchInputValue={setInputValue}
              params={centerParams}
              startgeocode={startgeocode}
              setStartGeoCode={setStartGeoCode}

              searchFields={[
                {
                  entityType: "location",
                  fieldApiName: "builtin.location",
                },
              ]} label={""} sectioned={false} handleInputValue={function (): void {
                throw new Error("Function not implemented.");
              } }          />
              <VerticalResults<Location>
                                displayAllOnNoResults={false}
                                locationResults={locationResults}
                                customCssClasses={{
                                  verticalResultsContainer:
                                    "result-list flex flex-col scroll-smooth overflow-auto",
                                }}
                                CardComponent={LocationCard}
                              />
        </div>
        <div className="w-2/3">
        <GoogleMaps
                  apiKey={googleApikey}
                  centerLatitude={center_latitude}
                  centerLongitude={center_longitude}
                  check={true}
                  defaultZoom={mapzoom}
                  showEmptyMap={true}
                />
        </div>
      </div>
      </Wrapper>
    </>
  );
};

export default searchLayout;