import * as React from "react";
import "../index.css";
import {
  GetHeadConfig,
  GetPath,
  HeadConfig,
  Template,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import {
  SearchHeadlessProvider,
  provideHeadless,
} from "@yext/search-headless-react";
import PageLayout from "../components/PageLayout";
import SearchLayout from "../components/SearchLayout";
import {
  stagingBaseurl,
  AnswerExperienceConfig,
  AnalyticsEnableDebugging,
  AnalyticsEnableTrackingCookie,
  metaBots,
} from "../../sites-global/global";
import { JsonLd } from "react-schemaorg";
import { StaticData } from "../../sites-global/staticData";
import {
  AnalyticsProvider,
  AnalyticsScopeProvider,
} from "@yext/pages/components";

import favIcon from "../assets/images/favicon.ico";
import ChatBot from "../commons/ChatBot";


/**
 *
 *
 * This allows the user to define a function which will take in their template
 * data and procure a HeadConfig object. When the site is generated, the HeadConfig
 * will be used to generate the inner contents of the HTML document's <head> tag.
 * This can include the title, meta tags, script tags, etc.
 * @param param0
 * @returns
 */




export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  document,
}): HeadConfig => {
  return {
    title: `${
      document.c_meta_title ? document.c_meta_title : StaticData.Meta_title
    }`,
    viewport: "width=device-width, initial-scale=1",
    tags: [
      {
        type: "meta",
        attributes: {
          name: "description",
          content: `${
            document.c_meta_description
              ? document.c_meta_description
              : StaticData.Meta_description
          }`,
        },
      },

      {
        type: "meta",
        attributes: {
          name: "author",
          content: StaticData.Brandname,
        },
      },

      {
        type: "meta",
        attributes: {
          name: "robots",
          content: metaBots,
        },
      },
      {
        type: "link",
        attributes: {
          rel: "shortcut icon",
          href: favIcon,
        },
      },

      {
        type: "link",
        attributes: {
          rel: "canonical",
          href: `${
            document._site?.c_canonical ? document?.c_canonical : stagingBaseurl
          }`,
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:description",
          content: `${
            document.c_meta_description
              ? document.c_meta_description
              : StaticData.Meta_description
          }`,
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:title",
          content: `${
            document.c_meta_title
              ? document.c_meta_title
              : StaticData.Meta_title
          }`,
        },
      },
      {
        type: "meta",
        attributes: {
          property: "og:image",
          content: document._site?.c_header_logo?.image?.url
            ? document._site?.c_header_logo?.image?.url
            : "",
        },
      },
      {
        type: "meta",
        attributes: {
          name: "twitter:card",
          content: "summary",
        },
      },
      {
        type: "meta",
        attributes: {
          name: "twitter:description",
          content: `${
            document.c_meta_description
              ? document.c_meta_description
              : StaticData.Meta_description
          }`,
        },
      },
      {
        type: "meta",
        attributes: {
          name: "twitter:image",
          content: document._site?.c_header_logo?.image?.url
            ? document._site?.c_header_logo?.image?.url
            : "",
        },
      },
    ],
    other:`<link rel="stylesheet" href="https://assets.sitescdn.net/chat/v0/chat.css" />
    <script defer src="https://assets.sitescdn.net/chat/v0/chat.umd.js" onload="initChat()"></script>
    <script>
      function initChat() {
        window.ChatApp.mount({
          apiKey: "7fb3fa694baea996017661b8b26abaaf",
          botId: "test",
          title: "test",
          stream: false,
          env: "SANDBOX",
        });
      }
    </script>`
  };
};

export const getPath: GetPath<TemplateProps> = () => {
  return `store`;
};

const Locator: Template<TemplateRenderProps> = ({ document }) => {
  const { _site, _meta } = document;

  console.log("document", document);
  const templateData = { document, _meta };

  const socialLinks: any = [];
  _site?.c_socialIcons?.map((c_socialIcon: any, index: number) => {
    socialLinks.push(c_socialIcon.cTA.link);
  });

  const searcher = provideHeadless({
    apiKey: AnswerExperienceConfig.apiKey,
    experienceKey: AnswerExperienceConfig.experienceKey,
    locale: AnswerExperienceConfig.locale,
    endpoints: AnswerExperienceConfig.endpoints,
    verticalKey: AnswerExperienceConfig.verticalKey,
  });

  return (
    <>
      <JsonLd<Organization>
        item={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Carpetright",
          url: "",
          logo: document._site?.c_header_logo?.image?.url
            ? document._site?.c_header_logo?.image?.url
            : "",
          address: {
            "@type": "PostalAddress",

            addressCountry: "United Kingdom",
          },
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "contact",
          },
          sameAs: socialLinks,
        }}
      />
      <JsonLd<BreadcrumbList>
        item={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": "Store-locator",
              name: "Home",
            },
          },
        }}
      />
{/* <ChatBot/> */}
      <AnalyticsProvider
        templateData={templateData}
        enableDebugging={AnalyticsEnableDebugging}
        enableTrackingCookie={AnalyticsEnableTrackingCookie}
      >
        <AnalyticsScopeProvider name={""}>
          <PageLayout _site={_site}>
            <SearchHeadlessProvider searcher={searcher}>
              <SearchLayout  />
            </SearchHeadlessProvider>
          </PageLayout>
        </AnalyticsScopeProvider>
      </AnalyticsProvider>
    </>
  );
};

export default Locator;
