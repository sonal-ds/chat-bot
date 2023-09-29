import { useSearchActions, useSearchState } from "@yext/search-headless-react";
import FilterSearch from "../locatorPage/FilterSearch";
import {
  AnswerExperienceConfig,
  center_latitude,
  center_longitude,
} from "../../sites-global/global";
// import { v4 as uuid } from "uuid";

import React, {
  KeyboardEvent,
  useRef,
  useEffect,
  useState,
  useMemo,
  ChangeEvent,
} from "react";
import { Matcher, SelectableFilter } from "@yext/answers-headless-react";
import { scrollToRow } from "./GoogleMaps";
//   import errorbox from "../../images/error-status-icon.png";

export interface InputDropdownCssClasses {
  inputDropdownContainer?: string;
  inputDropdownContainer___active?: string;
  dropdownContainer?: string;
  filterSearchContainer?: string;
  inputElement?: string;
  inputContainer?: string;
  divider?: string;
  logoContainer?: string;
  searchButtonContainer?: string;
}

interface Props {
  inputValue?: string;

  setInputValue: (params: { latitude: number; longitude: number }) => void;
  placeholder?: string;
  screenReaderInstructions: string;
  screenReaderText: string;
  onlyAllowDropdownOptionSubmissions?: boolean;
  forceHideDropdown?: boolean;
  onSubmit?: (value: string) => void;
  renderSearchButton?: () => JSX.Element | null;
  renderLogo?: () => JSX.Element | null;
  onInputChange: (value: string) => void;
  onInputFocus: (value: string) => void;
  onDropdownLeave?: (value: string) => void;
  cssClasses?: InputDropdownCssClasses;
  handleSetUserShareLocation: (value: string, userShareStatus: boolean) => void;
  handleInputValue: () => void;
  setSearchString: (searchString: string) => void;
  setDisplaymsg: (displaymsg: boolean) => void;

  setPostalLoading: (postalLoading: boolean) => void;
  setStartGeoCode: (startgeoCode: boolean) => void;
  setCheckAllowed: (checkAllowed: boolean) => void;
  setAllowResult: (allowResult: boolean) => void;
  setErrorStatus: (error: boolean) => void;

  getCoordinates: (coords: string) => void;
  setSearchInputValue: (inputValue: string) => void;

  displaymsg: boolean;
  errorstatus: boolean;
  startgeocode: boolean;
  updateParam?: (params: { latitude: number; longitude: number }) => void;
  params: { latitude: number; longitude: number };
}

export default function GoogleInput({
  inputValue = "",
  params,
  displaymsg,
  errorstatus,
  setSearchString,
  setPostalLoading,
  onInputChange,
  onInputFocus,
  handleInputValue,
  setDisplaymsg,
  setStartGeoCode,
  getCoordinates,
  setCheckAllowed,
  setErrorStatus,
  setInputValue,
}: React.PropsWithChildren<Props>): JSX.Element | null {
  const [latestUserInput, setLatestUserInput] = useState(inputValue);
  const [keyUpStatus, setKeyUpStatus] = useState(true);
  const locationinbuit =
    useSearchState((state) => state.vertical?.results) || [];
  const loading = useSearchState((s) => s.searchStatus.isLoading);
  const locationResults = useSearchState((s) => s.vertical.results) || [];
  const allResultsForVertical =
    useSearchState(
      (state) =>
        state.vertical?.noResults?.allResultsForVertical.results?.length
    ) || 0;
  const searchActions = useSearchActions();

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete>();
  const googleLib = typeof google !== "undefined" ? google : null;
  /**
   * Handles changing which section should become focused when focus leaves the currently-focused section.
   * @param pastSectionEnd Whether the section focus left from the end or the beginning of the section.
   */
  const locationFilter: SelectableFilter = {
    selected: true,
    fieldId: "builtin.location",
    value: {
      lat: center_latitude,
      lng: center_longitude,
      radius: AnswerExperienceConfig.locationRadius,
    },
    matcher: Matcher.Near,
  };

  function handleDocumentKeyUp(evt: KeyboardEvent<HTMLInputElement>): void {
    if (["ArrowDown", "ArrowUp"].includes(evt.key)) {
      evt.preventDefault();
    }
    if (evt.key === "Enter" && latestUserInput !== "") {
      scrollToRow(0);

      setSearchString("");
      setCheckAllowed(false);
      setDisplaymsg(false);
      setLatestUserInput("");
      if (keyUpStatus && !loading) {
        searchActions.setStaticFilters([locationFilter]);
        searchActions.setQuery("");
        searchActions.setOffset(0);
        searchActions.setUserLocation(params);
        searchActions.setVerticalLimit(AnswerExperienceConfig.limit);
        searchActions.setLocationRadius(AnswerExperienceConfig.locationRadius);

        searchActions.executeVerticalQuery();
        setKeyUpStatus(false);
      }
      const searchKey = document.getElementsByClassName(
        "FilterSearchInput"
      )[0] as HTMLInputElement;
      const Search = searchKey.value;

      setErrorStatus(false);
      setStartGeoCode(true);
      setLatestUserInput(Search);
      getCoordinates(Search);
    }
    if (evt.key === "Enter" && latestUserInput === "") {
      setErrorStatus(true);
    }

    handleInputValue();
    // if (evt.key === "Backspace" || evt.key === "x" || evt.key === "Delete") {
    if (inputValue === "") {
      scrollToRow(0);
      setSearchString("");
      setCheckAllowed(false);
      setDisplaymsg(false);
      setLatestUserInput("");
      if (keyUpStatus && !loading) {
        searchActions.setStaticFilters([locationFilter]);
        searchActions.setQuery("");
        searchActions.setOffset(0);
        searchActions.setUserLocation(params);
        searchActions.setVerticalLimit(AnswerExperienceConfig.limit);
        searchActions.setLocationRadius(AnswerExperienceConfig.locationRadius);
        searchActions.executeVerticalQuery();
        setKeyUpStatus(false);
      }
    }
    // }
  }

  useEffect(() => {
    if (inputValue != "") {
      setKeyUpStatus(true);
      setErrorStatus(false);
      setLatestUserInput(inputValue);
    } else {
      setCheckAllowed(false);
    }
  }, [inputValue]);
  useEffect(() => {
    if (googleLib && typeof google.maps === "object") {
      const pacInput: HTMLInputElement | null = document?.getElementById(
        "pac-input"
      ) as HTMLInputElement | null;

      if (pacInput !== null) {
        const options: google.maps.places.AutocompleteOptions = {
          componentRestrictions: { country: "GB" },
          fields: ["address_component", "geometry"],
        };

        const autoComplete = new google.maps.places.Autocomplete(
          pacInput,
          options
        );

        if (autoComplete) {
          const pacSelectFirst = (input: HTMLInputElement) => {
            const _addEventListener = input.addEventListener;

            const getEvent = () => {
              const keydown = document.createEvent("HTMLEvents");
              keydown.initEvent("keydown", true, false);
              Object.defineProperty(keydown, "keyCode", {
                get: function () {
                  return 40;
                },
              });
              Object.defineProperty(keydown, "which", {
                get: function () {
                  return 40;
                },
              });
              input.dispatchEvent(keydown);
            };
            function addEventListenerWrapper(type: string, listener: any) {
              if (type == "keydown") {
                const orig_listener = listener;

                listener = function (event: { which: number }) {
                  const suggestion_selected =
                    document.getElementsByClassName("pac-item-selected")
                      .length > 0;

                  if (
                    (event.which == 13 || event.which == 9) &&
                    !suggestion_selected
                  ) {
                    getEvent();
                    orig_listener.apply(input, [event]);
                  }

                  orig_listener.apply(input, [event]);
                };
              }

              _addEventListener.apply(input, [type, listener]);
            }

            if (input.addEventListener) {
              input.addEventListener = addEventListenerWrapper;
            }
          };

          setAutocomplete(autoComplete);
          pacSelectFirst(pacInput);

          google.maps.event.addListener(
            autoComplete,
            "place_changed",
            function () {
              const searchKey: string = pacInput.value;
              const place = autoComplete.getPlace();
              scrollToRow(0);
              if (searchKey && place.address_components != undefined) {
                // setInputValue(searchKey);
                getCoordinates(searchKey);
                // setInputValue(searchKey)
                // updateParam(searchKey);
                // getGoogleInput(searchKey);
              }
            }
          );
        }
      }
    }
    return () => {
      if (autocomplete) {
        autocomplete.unbindAll();
      }
    };
  }, [googleLib]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentValue: string | null = urlParams.get("myParam");
    if (latestUserInput !== currentValue) {
      if (currentValue !== "" && currentValue !== null) {
        setLatestUserInput(currentValue);
        getCoordinates(currentValue);
      }
      // Do something with the updated value, such as update a form field or make an API call
    }
  }, []);

  useEffect(() => {
    document.removeEventListener("keydown", Findinput);
    if (latestUserInput === "") {
      setDisplaymsg(false);
    } else if (!loading && locationResults.length == 0) {
      setDisplaymsg(true);
    }
    setDisplaymsg(false);
  });
  useEffect(() => {
    setLatestUserInput(inputValue);
  }, [inputValue]);

  const Findinput = () => {
    const searchKeyElements: HTMLCollectionOf<HTMLInputElement> =
      document.getElementsByClassName(
        "FilterSearchInput"
      ) as HTMLCollectionOf<HTMLInputElement>;

    const searchKey: string = searchKeyElements[0]?.value || "";

    const pacInput: HTMLInputElement | null = document.getElementById(
      "pac-input"
    ) as HTMLInputElement | null;

    if (pacInput !== null) {
      const Search: string = pacInput.value;
      if (Search !== "") {
        getCoordinates(Search);
      } else {
        // Only call getCoordinates if the search key is not empty
        if (searchKey !== "") {
          getCoordinates(inputValue);
        }
      }

      if (locationinbuit.length === 0 && !loading && searchKey !== "") {
        setDisplaymsg(true);
      } else {
        setDisplaymsg(false);
      }
    }
  };

  const onSearchClick = () => {
    const pacInput = document.getElementById("pac-input") as HTMLInputElement;
    const keydown = new Event("keydown");
    Object.defineProperties(keydown, {
      keyCode: { get: () => 13 },
      which: { get: () => 13 },
    });
    pacInput?.dispatchEvent(keydown);

    const suggestionSelected =
      document.getElementsByClassName("pac-item-selected").length > 0;
    if (!suggestionSelected) {
      Findinput();
    }
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    // setDisplaymsg(false);
    // setPostalLoading(false);
    // setLatestUserInput(value);
    onInputChange(value);
    // onInputFocus(value);
    // setChildrenKey(childrenKey + 1);
  };

  return (
    <>
      <div className="search-bar">
        <input
          id="pac-input"
          type="text"
          required={true}
          placeholder={"e.g. London, UK"}
          className="FilterSearchInput search-input"
          onChange={handleInputChange}
          onKeyUp={handleDocumentKeyUp}
          value={inputValue !== "" ? inputValue : latestUserInput}
          // aria-activedescendant={focusedOptionId}
        />
        {errorstatus && (
          <span className="Error-msg">Please fill out this field</span>
        )}
      </div>
      {(locationResults.length == 0 && allResultsForVertical > 0) ||
      (locationResults.length == 0 && displaymsg && !loading) ? (
        <h4 className="font-bold">
          Sorry we do not have any location in your area here you can check
          other stores
        </h4>
      ) : (
        ""
      )}

      <div className="search-btn">
        <button
          aria-label="Search bar icon"
          id="search-location-button"
          onClick={onSearchClick}
        >
          Search
        </button>
      </div>
    </>
  );
}
