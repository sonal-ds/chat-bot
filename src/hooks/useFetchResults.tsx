import { useSearchState } from "@yext/search-headless-react";

interface LocationResult {
  id?: string;
  
}

const useFetchResults = () => {
  const locationResults = useSearchState((s) => s.vertical.results) || [];
  const alternativeResults = useSearchState(
    (s) => s.vertical.noResults?.allResultsForVertical.results
  ) || [];

  const offset: number = useSearchState((s) => s.vertical.offset) || 0;

  let mapLocations: LocationResult[] = [];
  if (offset === 0) {
    mapLocations = [];
  }

  const extractUniqueLocations = (locations: LocationResult[]) => {
    const uniqueLocations: LocationResult[] = [];

    locations.forEach((location) => {
      const isLocationExists = uniqueLocations.some(
        (existLocation) => existLocation.id === location.id
      );

      if (!isLocationExists) {
        uniqueLocations.push(location);
      }
    });

    return uniqueLocations;
  };

  if (locationResults.length > 0) {
    mapLocations = extractUniqueLocations([...mapLocations, ...locationResults]);
  } else {
    mapLocations = extractUniqueLocations([...mapLocations, ...alternativeResults]);
  }

  return mapLocations;
};

export default useFetchResults;
