import { useRef, useState } from "react";
import {
  useSearchActions,
  FilterSearchResponse,
  SearchParameterField,
  FieldValueFilter,
  Filter,
} from "@yext/search-headless-react";
import { DropdownSectionCssClasses, Option } from "./DropdownSection";
import { processTranslation } from "./utils/processTranslation";
import { useSynchronizedRequest } from "../hooks/useSynchronizedRequest";
import renderAutocompleteResult, {
  AutocompleteResultCssClasses,
} from "./utils/renderAutocompleteResult";
import {
  CompositionMethod,
  useComposedCssClasses,
} from "../hooks/useComposedCssClasses";
import { AnswerExperienceConfig } from "../../sites-global/global";
import * as React from "react";
import GoogleInput from "./GoogleInput";

const SCREENREADER_INSTRUCTIONS = "";

interface InputDropdownCssClasses {
  inputDropdownContainer?: string;
  inputDropdownContainer___active?: string;
  dropdownContainer?: string;
  inputElement?: string;
  inputContainer?: string;
  divider?: string;
  logoContainer?: string;
  searchButtonContainer?: string;
}

interface FilterSearchCssClasses
  extends InputDropdownCssClasses,
    DropdownSectionCssClasses,
    AutocompleteResultCssClasses {
  container?: string;
  label?: string;
  filterSearchContainer?: string;
}

const builtInCssClasses: FilterSearchCssClasses = {
  container: "mb-2 w-full",
  label: "mb-4 text-sm font-medium text-gray-900",
  dropdownContainer:
    "absolute z-10 shadow-lg w-full border border-[#8c8c8c] bg-white pt-3 pb-1 px-4 mt-1",
  inputElement:
    "text-sm bg-white outline-none h-9 w-full p-2 rounded-md border border-gray-300 focus:border-blue-600",
  sectionContainer: "pb-2",
  sectionLabel: "text-sm text-gray-700 font-semibold pb-2",
  focusedOption: "bg-gray-100",
  option: "text-sm text-gray-700 pb-1 cursor-pointer",
};

export interface FilterSearchProps {
  label: string;
  sectioned: boolean;
  searchFields: Omit<SearchParameterField, "fetchEntities">[];
  customCssClasses?: FilterSearchCssClasses;
  cssCompositionMethod?: CompositionMethod;
  searchInputValue?: string;
  handleInputValue: () => void;
  handleSetUserShareLocation?: () => void;
  inputvalue: string;
  params: { latitude: number; longitude: number };
  setSearchString: (value: string) => void;
  displaymsg: boolean;
  setDisplaymsg: (value: boolean) => void;
  setSearchInputValue: (value: string) => void;
  setAllowResult: (value: boolean) => void;
  startgeocode: boolean;
  setStartGeoCode: (value: boolean) => void;
  getCoordinates: (coords: string) => void;
  setPostalLoading: (value: boolean) => void;
  setCheckAllowed: (value: boolean) => void;
  updateParam?: (param: object) => void;
  errorstatus: boolean; // Update the type to the specific type of `errorstatus`
  setErrorStatus: (value: boolean) => void; // Update the type to the specific type of `setErrorStatus`
  checkallowed: boolean; // Update the type to the specific type of `checkallowed`
  handleEndPointCallBack?: any; // Update the type to the specific type of `handleEndPointCallBack`
  Placeholder?: string; //


}

type FilterHandle = {
  setInputValue: (value: string) => void;
  setParam: (param: { latitude: number; longitude: number }) => void;
  getInputValue: () => string;
};
const FilterSearch = React.forwardRef<FilterHandle, FilterSearchProps>(
  (
    {
      sectioned,
      searchFields,
      customCssClasses,
      cssCompositionMethod,
      handleInputValue,
      handleSetUserShareLocation,
      inputvalue,
      params,
      displaymsg,
      setDisplaymsg,
      setSearchInputValue,
      setAllowResult,
      startgeocode,
      setSearchString,
      setStartGeoCode,
      getCoordinates,
      setPostalLoading,
      setCheckAllowed,
      updateParam,
      errorstatus,
      setErrorStatus,

      Placeholder,
    }: FilterSearchProps,
    ref
  ): JSX.Element => {
    const searchAction = useSearchActions();
    const [input, setInput] = useState(inputvalue);
    const [newparam, setNewParam] = useState(params);
    const selectedFilterOptionRef = useRef<Filter | null>(null);

    console.log("selectedFilterOptionRef", selectedFilterOptionRef.current);
    const searchParamFields = searchFields.map((searchField) => {
      return { ...searchField, fetchEntities: false };
    });
    React.useImperativeHandle(ref, () => {
      return {
        setInputValue: (value: string) => setInput(value),
        setParam: (param: { latitude: number; longitude: number }) => setNewParam(param),
        getInputValue: () => {
          return input;
        },
      };
    });
    const cssClasses = useComposedCssClasses(
      builtInCssClasses,
      customCssClasses,
      cssCompositionMethod
    );

    const [filterSearchResponse, executeFilterSearch] = useSynchronizedRequest<
      string,
      FilterSearchResponse
    >((inputValue) =>
      searchAction.executeFilterSearch(
        inputValue ?? "",
        sectioned,
        searchParamFields
      )
    );

    let sections: { results: Option[]; label?: string }[] = [];

    if (filterSearchResponse) {
      sections = filterSearchResponse.sections.map((section) => {
        return {
          results: section.results.map((result) => {
            return {
              value: result.value,
              onSelect: () => {
                setInput(result.value);

                if (result?.filter) {
                  if (selectedFilterOptionRef.current) {
                    searchAction.setFilterOption({
                      ...selectedFilterOptionRef.current,
                      selected: false,
                    });
                  }

                  selectedFilterOptionRef.current = result.filter;

                  searchAction.setOffset(0);
                  searchAction.setVerticalLimit(AnswerExperienceConfig.limit);
                  searchAction.executeVerticalQuery();
                  searchAction.setLocationRadius(AnswerExperienceConfig.locationRadius)
                }
              },
              display: renderAutocompleteResult(result, cssClasses),
            };
          }),
          label: section.label,
        };
      });
    }

    sections = sections.filter((section) => section.results.length > 0);

    let screenReaderText = processTranslation({
      phrase: `0 autocomplete option found.`,
      pluralForm: `0 autocomplete options found.`,
      count: 0,
    });
    if (sections.length > 0) {
      const screenReaderPhrases = sections.map((section) => {
        const optionInfo = section.label
          ? `${section.results.length} ${section.label}`
          : `${section.results.length}`;
        return processTranslation({
          phrase: `${optionInfo} autocomplete option found.`,
          pluralForm: `${optionInfo} autocomplete options found.`,
          count: section.results.length,
        });
      });
      screenReaderText = screenReaderPhrases.join(" ");
    }

    return (
      <GoogleInput

        setAllowResult={setAllowResult}
        inputValue={input}
        errorstatus={errorstatus}
        setErrorStatus={setErrorStatus}
        updateParam={updateParam}
        setCheckAllowed={setCheckAllowed}
        setPostalLoading={setPostalLoading}
        getCoordinates={getCoordinates}
        setSearchInputValue={setSearchInputValue}
        setSearchString={setSearchString}
        displaymsg={displaymsg}
        setDisplaymsg={setDisplaymsg}
        params={newparam}
        setStartGeoCode={setStartGeoCode}
        startgeocode={startgeocode}
        placeholder={Placeholder}
        screenReaderInstructions={SCREENREADER_INSTRUCTIONS}
        screenReaderText={screenReaderText}
        onlyAllowDropdownOptionSubmissions={true}
        onInputChange={(newInput: string) => {
          setInput(newInput);
          handleInputValue();
        }}
        onInputFocus={(input: string) => {
          executeFilterSearch(input);
        }}
        cssClasses={cssClasses}
        handleSetUserShareLocation={handleSetUserShareLocation}
        handleInputValue={handleInputValue}
      />
    );
  }
);

export default FilterSearch;
