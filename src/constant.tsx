const constant = {
  slugify(slugString: any) {
    slugString.toLowerCase().toString();
    slugString = slugString.replace(/[&\/\\#^+()$~%.'":*?<>{}!@]/g, "");
    slugString = slugString.replaceAll("  ", "-");
    slugString = slugString.replaceAll(" ", "-");
    slugString = slugString.replaceAll(",", "");
    return slugString.toLowerCase();
  },
  formatPhoneNumber(phoneNumberString: any) {
    phoneNumberString = phoneNumberString
      .replace(/\D+/g, "")
      .replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "+$1 ($2) $3-$4");
    return phoneNumberString;
  },
  formatWithoutCountryCodePhoneNumber(input: any) {
    if (!input || isNaN(input)) {
      return input;
    }
    input = input.replace("+1", "");
    if (typeof input !== "string") input = input.toString();
    if (input.length === 10) {
      return input.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    } else if (input.length < 10) {
      return input;
    } else if (input.length > 10) {
      return input;
    } else {
      return input;
    }
  },
  getLocationSlugUri(id: any, address: any, slug: any) {
    let url = "";
    if (!slug) {
      let slugString: any = "";
      if (typeof address.line1 != "undefined") {
        slugString += address.line1;
      }
      if (typeof address.line2 != "undefined") {
        slugString += " " + address.line2;
      }

      if (slugString) {
        slugString = constant.slugify(slugString);
      } else {
        slugString = constant.slugify(id);
      }

      url = `${constant.slugify(address.region)}/${constant.slugify(
        address.city
      )}/${slugString}`;
    } else {
      url = `${constant.slugify(address.region)}/${constant.slugify(
        address.city
      )}/${constant.slugify(slug)}`;
    }
    url = url + ".html";
    return url;
  },
  addFilterParams(features: string) {
    const searchParams = new URLSearchParams(window.location.search);
    const searchFeatures = searchParams.getAll("features");
    if (searchFeatures.length > 0) {
      if (!searchFeatures.includes(features)) {
        searchParams.append("features", features);
      }
    } else {
      searchParams.set("features", features);
    }
    const newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      searchParams.toString();
    window.history.replaceState({}, "", newUrl);
  },
};
export default constant;
