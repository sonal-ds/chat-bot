import {
  useSearchUtilities,
  DisplayableFacet,
  DisplayableFacetOption,
} from "@yext/search-headless-react";
import React from "react";

import {
  CompositionMethod,
  useComposedCssClasses,
} from "../hooks/useComposedCssClasses";
import renderCheckboxOption, {
  CheckboxOptionCssClasses,
} from "./utils/renderCheckboxOption";

export type onFacetChangeFn = (
  fieldId: string,
  option: DisplayableFacetOption
) => void;

export interface FacetConfig {
  searchable?: boolean;
  placeholderText?: string;
  label?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface FacetProps extends FacetConfig {
  facet: DisplayableFacet;
  onToggle: onFacetChangeFn;
  customCssclasses?: FacetCssClasses;
  cssCompositionMethod?: CompositionMethod;
}

export interface FacetCssClasses extends CheckboxOptionCssClasses {
  label?: string;
  labelIcon?: string;
  labelContainer?: string;
  optionsContainer?: string;
  searchableInputElement?: string;
}

const builtInCssClasses: FacetCssClasses = {
  label: "text-green text-xl font-medium text-left w-full hidden",
  labelIcon: "w-3 mx-2",
  labelContainer: "heading-item",
  optionsContainer: "flex flex-wrap Filter-text ",
};

export default function Facet(props: FacetProps): JSX.Element {
  const {
    facet,
    onToggle,
    searchable,
    customCssclasses,
    cssCompositionMethod,
  } = props;
  const cssClasses = useComposedCssClasses(
    builtInCssClasses,
    customCssclasses,
    cssCompositionMethod
  );
  const answersUtilities = useSearchUtilities();

  cssClasses.labelIcon = cssClasses.labelIcon ?? "";
  const facetOptions = searchable
    ? answersUtilities.searchThroughFacet(facet, "").options
    : facet.options;

  return (
    <>
      <div className={cssClasses.optionsContainer}>
        {facetOptions.map((option) =>
          renderCheckboxOption({
            option: {
              id: option.displayName,
              label: `${option.displayName} `,
            },
            onClick: () => onToggle(facet.fieldId, option),
            selected: option.selected,
          })
        )}
      </div>
    </>
  );
}
