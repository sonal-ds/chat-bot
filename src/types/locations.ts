import { CTA } from "@yext/pages/components";
import { EmailLink } from "../components/layout/Accordian";

export interface Interval {
  start: string;
  end: string;
}

export interface DayHour {
  openIntervals?: Interval[];
  isClosed?: boolean;
}

export interface HolidayHours {
  date: string;
  openIntervals?: Interval[];
  isClosed?: boolean;
  isRegularHours?: boolean;
}

export type DayStringType =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface WeekType {
  monday?: DayHour;
  tuesday?: DayHour;
  wednesday?: DayHour;
  thursday?: DayHour;
  friday?: DayHour;
  saturday?: DayHour;
  sunday?: DayHour;
}
export interface Hours extends WeekType {
  holidayHours?: HolidayHours[];
  reopenDate?: string;
}

export enum PickupAndDeliveryServices {
  IN_STORE_PICKUP = "In-Store Pickup",
  CURBSIDE_PICKUP = "Curbside Pickup",
  PICKUP_NOT_OFFERED = "Pickup Not Offered",
  DELIVERY = "Delivery",
  SAME_DAY_DELIVERY = "Same Day Delivery",
  NO_CONTACT_DELIVERY = "No-Contact Delivery",
  DELIVERY_NOT_OFFERED = "Delivery Not Offered",
}

export interface Address {
  line1: string;
  line2?: string;
  line3?: string;
  sublocality?: string;
  city: string;
  region?: string;
  postalCode: string;
  countryCode: string;
}

export interface c_getDirection {
  c_getDirection?: string;
}
export interface ImageThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Image {
  url: string;
  width: number;
  height: number;
  thumbnails?: ImageThumbnail[];
  alternateText?: string;
}

export interface ComplexImage {
  image: Image;
  details?: string;
  description?: string;
  clickthroughUrl?: string;
  url: string;
  alternateText?: string;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface EntityReference {
  entityId: string;
  name: string;
}

export type EntityType = {
  id: string;
};

export interface Meta {
  entityType: EntityType;
  locale: string;
}
export type TemplateMeta = {
  mode: "development" | "production";
};

export type DirectoryParent = {
  slug1?: string;
  name1?: string;
  id?: number;
  continent?: string;
  slug: string;
  name: string;
  meta?: Meta;
  length?: number;
  entityType?: DirectoryParent;
  dm_directoryChildrenCount?: number;
  dm_baseEntityCount?: number;
  dm_directoryParent?: DirectoryParent;
}[];

export type DirectoryChildren = {
  mainPhone?: string;
  c_directionsText?: string;
  address: Address;
  hours?: Hours;
  timezone: string;
  linkType?: string;
  index?: number;
  c_provinceDirectory: string;
  c_region: string;
  slug: string;
  name: string;
  id: string;
  meta?: Meta;
  dm_directoryChildrenCount: number;
  dm_baseEntityCount: number;
  dm_directoryChildren?: DirectoryChildren;
}[];

export interface ContinentDocument {
  id: string;
  uid: string;
  meta: Meta;
  name: string;
  slug: string;
  _site: SiteData;
  address: Address;
  c_metaTitle: string;
  c_metaDescription: string;
  c_robotsTag: string;
  c_canonicalURL: URL | string;
  c_children: DirectoryChildren;
  alternateLanguageFields: any;
  dm_directoryChildren: DirectoryChildren;
  dm_directoryParents: DirectoryParent;
}

export interface CountryDocument {
  id: string;
  _site: SiteData;
  address: Address;
  uid: string;
  meta: Meta;
  name: string;
  slug: string;
  c_robotsTag: string;
  c_metaTitle: string;
  c_metaDescription: string;
  c_canonicalURL: URL | string;
  dm_directoryChildren: DirectoryChildren;
  dm_directoryParents: DirectoryParent;
}

export interface CityDocument {
  id: string;
  uid: string;
  meta: Meta;
  name: string;
  slug: string;
  address: Address;
  timezone: string;
  _site: SiteData;
  c_metaTitle: string;
  c_metaDescription: string;
  c_canonicalURL: URL | string;
  dm_directoryChildren: DirectoryChildren;
  dm_directoryParents: DirectoryParent;
}

export interface SiteData {
  id?: number | undefined;
  meta: Meta;
  name?: string | undefined;
  mainPhone: string;
 }

export interface FeaturedMessage {
  description?: string;
  url?: string;
}

export enum LocationType {
  LOCATION = "Location",
  HEALTHCARE_FACILITY = "Healthcare Facility",
  HEALTHCARE_PROFESSIONAL = "Healthcare Professional",
  ATM = "ATM",
  RESTAURANT = "Restaurant",
  HOTEL = "Hotel",
}

export interface MenuUrl {
  url?: string;
  displayUrl?: string;
  preferDisplayUrl?: boolean;
}

export interface OrderUrl {
  url?: string;
  displayUrl?: string;
  preferDisplayUrl?: boolean;
}


export enum PriceRange {
  UNSPECIFIED = "Unspecified",
  ONE = "$",
  TWO = "$$",
  THREE = "$$$",
  FOUR = "$$$$",
}

export interface ReservationUrl {
  url?: string;
  displayUrl?: string;
  preferDisplayUrl?: boolean;
}

export enum Presentation {
  BUTTON = "Button",
  LINK = "Link",
}

export interface UberLink {
  text?: string;
  presentation: Presentation;
}

export interface UberTripBranding {
  text: string;
  url: string;
  description: string;
}

export interface WebsiteUrl {
  url?: string;
  displayUrl?: string;
  preferDisplayUrl?: boolean;
}

export interface ComplexVideo {
  url: string;
  video?: string;
  description?: string;
}


export interface CategoryProps {
  photos: elementProps[];
}

type elementProps = {
  categoryURL: string;
  image: ComplexImage;
  categoryName: string;
};
export interface SpecificDay {
    holidayDate?: Date;
    holidayName?: string;
}[];

export interface LocationData {
  id: string;
  meta: Meta;
  name?: string;
  slug?: string;
  hours: Hours;
  address: Address;
  timezone: string;
  mainPhone: string;
  geomodifier?: string;
   additionalHoursText?: string;
  c_get_direction_text: string;
  yextDisplayCoordinate?: Coordinate;
 _site:SiteData;
 

  dm_directoryParents: DirectoryParent;
  dm_directoryChildren: string;
}

export { CTA };