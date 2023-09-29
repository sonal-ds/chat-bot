import { useSearchState } from "@yext/search-headless-react";
import classNames from "classnames";
import * as React from "react";
import {
  CompositionMethod,
  useComposedCssClasses,
} from "../hooks/useComposedCssClasses";

interface ResultsCountCssClasses {
  container?: string;
  text?: string;
  number?: string;
}

const builtInCssClasses: ResultsCountCssClasses = {
  container: "pb-7 md:pb-4",
  text: "text-sm text-gray-700",
  number: "font-medium",
};



export interface ResultsCountConfig {
  resultsCount?: number;
  resultsLength?: number;
  searchString?: any;
  offset?: number;
  customCssClasses?: any;
  cssCompositionMethod?: CompositionMethod;
}

/**
 * Function to calculate location count
 * @param props : Custom CSS
 * @returns : Location Count
 */
export default function ResultsCount(props: any) {
  const { searchString } = props;
  const resultsCount =
    useSearchState((state) => state.vertical?.resultsCount) || 0;
  const resultsLength =
    useSearchState((state) => state.vertical?.results?.length) || 0;
  const offset = useSearchState((state) => state.vertical?.offset) || 0;

  return (
    <ResultsCountDisplay
      resultsCount={resultsCount}
      resultsLength={resultsLength}
      offset={offset}
      searchString={searchString}
      {...props}
    />
  );
}
export function ResultsCountDisplay({
  resultsLength = 0,
  searchString,
  customCssClasses,
  cssCompositionMethod,
}: ResultsCountConfig): JSX.Element | null {
  const cssClasses = useComposedCssClasses(
    builtInCssClasses,
    customCssClasses,
    cssCompositionMethod
  );
  if (resultsLength === 0) {
    return null;
  }

  const messageArray = [resultsLength, " stores near ", `"${searchString}"`];

  const spanArray = messageArray.map((value, index) => {
    const isNumber = typeof value === "number";

    const classes = classNames(cssClasses.text, {
      [cssClasses.number ?? ""]: isNumber,
    });

    return (
      <span key={`${index}-${value}`} className={classes}>
        {value}
      </span>
    );
  });
  return (
    <div className={cssClasses.container}>
      {searchString ? (
        <div className="text-[#464646] text-base">{spanArray}</div>
      ) : (
        ""
      )}
    </div>
  );
}
