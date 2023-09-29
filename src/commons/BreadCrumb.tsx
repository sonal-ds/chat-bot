import * as React from "react";
import { BaseUrl, slugify } from "../../config/globalConfig";
import { Link } from "@yext/pages/components";
import { Address as AddressType, DirectoryParent, SiteData } from "../../types/locations";

type BreadCrumbProps = {
  name: string|undefined;
  parents: DirectoryParent;
  address?: AddressType;
  site?: SiteData;
};
type DataProp = {
  slug: string;
  name: string;
};


const BreadCrumbs = (props: BreadCrumbProps) => {
  let breadcrumbs;
  const data: DirectoryParent = [];
  const regionNames = new Intl.DisplayNames(
    ["en"],
    { type: "region" }
  );

  const setURL = (res: { name?: string | undefined; parents: DirectoryParent; address?: AddressType | undefined; site?: SiteData | undefined; }) => {

    if (res?.parents) {
      let slugcomb="";
      
      for (let i = 0; i < res.parents.length; i++) {
        if (res?.parents[i]?.meta?.entityType.id == "ce_root") {
          res.parents[i].name;
          slugcomb=res.parents[i].slug;
          data.push({
            name: res.parents[i].name,
            slug: slugcomb,
          });
        }
         else if (res?.parents[i]?.meta?.entityType.id == "ce_country") {
          try {
           regionNames?.of(res.parents[i].name);

           
          } catch (error) {
           res.parents[i].name;
          }
          slugcomb =
            res.parents[i - 1].slug + "/" + res.parents[i].slug;

          data.push({
            name: res.parents[i].name,
            slug: slugcomb,
          });
        } 
        else if (res?.parents[i]?.meta?.entityType.id == "ce_region") {
          try {
           regionNames?.of(res.parents[i].name);

           
          } catch (error) {
           res.parents[i].name;
          }
          slugcomb =
          res.parents[i - 2].slug+ "/"+ res.parents[i - 1].slug + "/" + res.parents[i].slug;

          data.push({
            name: res.parents[i].name,
            slug: slugcomb,
          });
        } 
        else if (res?.parents[i]?.meta?.entityType.id == "ce_city") { 
           res.parents[i].name;
          slugcomb =
          slugcomb + "/" + res.parents[i].slug;
          data.push({
            name: res.parents[i].name,
            slug: slugcomb,
          });
        }
      }

      breadcrumbs = data.map((crumb: DataProp, index: number) => (
        <li key={crumb.slug}>
          <Link
            href={BaseUrl + "/store/" + crumb.slug }
            rel="noopener noreferrer"
            eventName={"BreadCrumbs" + (index + 1)}
          >
            {crumb.name}
          </Link>
        </li>
      ));

      return breadcrumbs;
    } else {
      return null;
    }
  };

  const list = setURL(props);

 

  return (
    <div className="breadcrumb">
      <div className="container-full-width">
        <ul>
          {/* <li>
            <a href="#">Home</a>
          </li> */}
          {/* <li>
            <a href={BaseUrl + "/"  + "store"}>
              Store
            </a>
          </li> */}
          {list ? (
            list
          ) : (
            <>
              {props.address && props.address.city && (
                <li>
                  <a href={"store/"+props.address.city}>
                    {props.address.city ? props.address.city : ""}
                  </a>
                </li>
              )}
            </>
          )}
          <li>{props && props.name}</li>
        </ul>
      </div>
    </div>
  );
};

export default BreadCrumbs;
