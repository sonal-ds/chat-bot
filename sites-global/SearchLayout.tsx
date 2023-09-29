import {
  useSearchState,
  useSearchActions,
  Matcher,
} from "@yext/search-headless-react";
import { useEffect, useState, useRef } from "react";
import * as React from "react";
import ResultsCount from "./ResultCount";
import VerticalResults from "./VerticalResults";
import { Location } from "../../types/search/locations";
import { SelectableFilter } from "@yext/answers-headless-react";

import { GoogleMaps, scrollToRow } from "./GoogleMaps";

import Geocode from "react-geocode";

import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import {
  AnswerExperienceConfig,
  center_latitude,
  center_longitude,
  googleApikey,
} from "../../../sites-global/global";

import FilterSearch from "../locatorPage/FilterSearch";
import useFetchResults from "../../hooks/useFetchResults";
import { Wrapper } from "@googlemaps/react-wrapper";
import useGetPostalCodeLatLng from "./useGetPostalCodeLatLng";
import Facets from "./Facets";
import LocationCard from "./LocationCard";

import currentLocation from "../../assets/images/nearby-location.png";

const centerParams: { latitude: number; longitude: number } = {
  latitude: center_latitude,
  longitude: center_longitude,
};
let mapzoom = 6;

interface SearchLayoutProps {
  _site: undefined;
  // Add other properties if needed
}

export const getParams = (url: string) => {
  const urlSearchParams = new URLSearchParams(url);
  return Object.fromEntries(urlSearchParams.entries());
};
/**
 * Function to search configuration
 * @param props : Location data
 * @returns : Location
 */

const SearchLayout = (props: SearchLayoutProps): JSX.Element => {

  console.log('props', props)
  type FilterHandle = React.ElementRef<typeof FilterSearch>;
  const filterRef = useRef<FilterHandle>(null);
  const locationResults = useFetchResults() || [];

  const [startgeocode, setStartGeoCode] = useState(false);
  const [displaymsg, setDisplaymsg] = useState(false);
  const [inputvalue, setInputValue] = useState("");
  const [errorstatus, setErrorStatus] = useState(false);
  const [, setPostalLoading] = useState(false);
  const [checkallowed, setCheckAllowed] = useState(false);
  const { postalcode } = useGetPostalCodeLatLng();

  const [, setallowLocation] = useState("");
  const [searchString, setSearchString] = useState("Unites State");
  const [, setAllowResult] = useState(false);
  const searchActions = useSearchActions();
  const [, setCheck] = useState(false);
  const [newparam, SetNewparam] = useState({ latitude: 0, longitude: 0 });
  let firstTimeRunners = true;

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
  useEffect(() => {
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
        <div className="main-content mt-20">
          <div className="locator-wrapper">
            <div className="locator-inner-wrapper">
              <div className="locator-content left-section">
                <h1>Find your local store</h1>
                <div className="find-store-suggestion">
                  <p>Find store by postcode, city, town, or street</p>
                </div>
                <div className="locator-searchWrapper">
                  <div className="search-form">
                    <div className="search-form-group">
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
                            fieldApiName: "address.postalCode",
                          },
                          {
                            entityType: "location",
                            fieldApiName: "address.city",
                          },
                          {
                            entityType: "location",
                            fieldApiName: "address.region",
                          },
                        ]}
                        handleInputValue={handleInputValue}
                        label={""}
                        sectioned={false}

                      />

                      <div className="geo-location">
                        <button
                          className="useMyLocation"
                          title="Search using your current location!"
                          id="useLocation"
                          onClick={onClick}
                        >
                          <img src={currentLocation} />

                          <span>Use current location</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="filters-block">
                    <Facets
                      inputvalue={filterRef.current?.getInputValue()}
                      searchOnChange={true}
                      searchable={false}
                      collapsible={true}
                      defaultExpanded={true}
                    />
                  </div>
                </div>
                <div className="locator-resultsWrapper">
                  {locationResults && locationResults.length > 0 ? (
                    <></>
                  ) : (
                    <>
                      {/* DM's Links show initially when user landes on locator page*/}

                      <div className="locator-initial">
                        <div className="locator-initialText">
                          <p>
                            Use our locator to find your nearest store.
                            Alternatively you can
                            <a
                              href="#"
                              className="underline hover:no-underline"
                            >
                              {" "}
                              browse our directory{" "}
                            </a>{" "}
                            or click on the specific country links below.
                          </p>
                        </div>
                        <div className="locator-countries">
                          <a href="#" className="locator-countryLink">
                            England
                          </a>
                          <a href="#" className="locator-countryLink">
                            Scotland
                          </a>
                          <a href="#" className="locator-countryLink">
                            Wales
                          </a>
                          <a href="#" className="locator-countryLink">
                            Northern Ireland
                          </a>
                          <a href="#" className="locator-countryLink">
                            Channel Islands
                          </a>
                          <a href="#" className="locator-countryLink">
                            Republic of Ireland
                          </a>
                        </div>
                      </div>
                      {/* DM's Links show initially when user landes on locator page*/}
                    </>
                  )}

                  <div className="locator-resultsContainer">
                    <div className="Locator-resultsSummary">
                      <p>
                        <ResultsCount
                          searchString={searchString}
                          customCssClasses={{
                            resultsCountContainer: "mx-2 my-0",
                          }}
                        />
                      </p>
                    </div>
                    {locationResults && locationResults.length > 0 ? (
                      <div className="locator-results">
                        <ul className="result-list">
                          <PerfectScrollbar>
                            
                              <VerticalResults<Location>
                                displayAllOnNoResults={false}
                                locationResults={locationResults}
                                customCssClasses={{
                                  verticalResultsContainer:
                                    "result-list flex flex-col scroll-smooth overflow-auto",
                                }}
                                CardComponent={LocationCard}
                              />
                            
                          </PerfectScrollbar>
                        </ul>
                      </div>
                    ) : (
                      <div className="p-4 bg-white">
                        <p>No Stores found.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="locator-mapBox right-section">
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
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default SearchLayout;
