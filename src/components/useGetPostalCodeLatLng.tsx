import { useState } from "react";
import { Matcher, SelectableFilter, useSearchActions } from "@yext/search-headless-react";
import { AnswerExperienceConfig, googleApikey, unitOfOneMile } from "../../sites-global/global";


const useGetPostalCodeLatLng = () => {
  const searchActions = useSearchActions();
  const [postalloading, setPostalLoading] = useState(false);
  const setLoading = (value: boolean) => {
    setPostalLoading(value);
  };
  let params: any;


  const postalcode = (
    postal: any,
    coordinates: { latitude: number; longitude: number },
    checkallowed: boolean,
  ) => {

   if(checkallowed !== true){ 
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${postal}&key=${googleApikey}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.status === "ZERO_RESULTS") {
          searchActions.setQuery("gkhvfdjgbdbg");
          searchActions.setUserLocation(coordinates);
          searchActions.setOffset(0);
          searchActions.setVerticalLimit(AnswerExperienceConfig.limit)
          searchActions.setLocationRadius(AnswerExperienceConfig.locationRadius);
          searchActions.executeVerticalQuery();
        } else if (json.results) {
          let status = false;
          json.results.map((components: any) => {
            for (let i = 0; i < components.address_components.length; i++) {
              const type = components.address_components[i].types[0];
              params = {
                latitude: components.geometry.location.lat,
                longitude: components.geometry.location.lng,
              };
              if (components.address_components[i].types.includes("country")) {
                if (components.address_components[i].short_name != "GB") {
                  status = true;
                }
              }
            }
          });
          const locationFilter: SelectableFilter = {
            selected: true,
            fieldId: "builtin.location",
            value: {
              lat: params.latitude,
              lng: params.longitude,
              radius: AnswerExperienceConfig.locationRadius,
            },
            matcher: Matcher.Near
          }
          if (status) {
            searchActions.setQuery(postal);
            searchActions.setUserLocation(coordinates);
            searchActions.setOffset(0);
            searchActions.setStaticFilters([locationFilter])
            searchActions.setVerticalLimit(AnswerExperienceConfig.limit)
            searchActions.executeVerticalQuery();
            searchActions.setLocationRadius(AnswerExperienceConfig.locationRadius)
          } else {
            searchActions.setUserLocation(params);
            searchActions.setQuery("");
            searchActions.setStaticFilters([locationFilter])
            searchActions.setVerticalLimit(AnswerExperienceConfig.limit)
            searchActions.executeVerticalQuery();
            searchActions.setLocationRadius(AnswerExperienceConfig.locationRadius)
          }
        }
      })
      .catch(() => {});
  }else{
    searchActions.setVertical("locations");
    searchActions.setQuery("");
    searchActions.setUserLocation(coordinates);
    searchActions.setOffset(0);
    searchActions.executeVerticalQuery();
    searchActions.setLocationRadius(AnswerExperienceConfig.locationRadius);
  }
};

  return { postalcode, setLoading, postalloading };
};

export default useGetPostalCodeLatLng;
