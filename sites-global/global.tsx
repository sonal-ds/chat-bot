export const googleApikey = "AIzaSyDZNQlSlEIkFAct5VzUtsP4dSbvOr2bE18";
export const center_latitude = 51.5074;
export const center_longitude = 0.1278;
export const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
export const stagingBaseurl = "https://neatly-picked-bat.pgsdemo.com/";
export const conversionDetailsDirection = {
  cid: "",
  cv: "1",
};

export const conversionDetailsPhone = {
  cid: "",
  cv: "2",
};

export const AnalyticsEnableDebugging = true;
export const AnalyticsEnableTrackingCookie = true;

export const metaBots = "noindex, nofollow";

export const unitOfOneMile = 1609.34;

/** Search Experience configuration */
export const AnswerExperienceConfig = {
  limit: 10,
  locale: "en",
  experienceKey: "coop-experies",
  apiKey: "c580f7fd9530b8d5e5557ae7719ae45f",
  verticalKey: "locations",
  experienceVersion: "STAGING",
  locationRadius: unitOfOneMile * 20,
  sessionTrackingEnabled: true,
  endpoints: {
    universalSearch: " https://liveapi-sandbox.yext.com/v2/accounts/me/answers/query",
    verticalSearch:
      " https://liveapi-sandbox.yext.com/v2/accounts/me/answers/vertical/query",
    questionSubmission:
      " https://liveapi-sandbox.yext.com/v2/accounts/me/createQuestion",
    universalAutocomplete:
      " https://liveapi-sandbox.yext.com/v2/accounts/me/answers/autocomplete",
    verticalAutocomplete:
      " https://liveapi-sandbox.yext.com/v2/accounts/me/answers/vertical/autocomplete",
    filterSearch:
      " https://liveapi-sandbox.yext.com/v2/accounts/me/answers/filtersearch",
  },
};

/**
 * CODE EXPLAIN:- convert normal text to slug
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}; 

export function getPathFromURL(url: string): string {
  const parsedURL = new URL(url);
  return parsedURL.pathname;
}
