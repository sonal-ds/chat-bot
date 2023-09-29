import { ChatHeadlessProvider, HeadlessConfig } from "@yext/chat-headless-react";
import { ChatPopUp } from "@yext/chat-ui-react";
import "@yext/chat-ui-react/bundle.css";
import * as React from "react";

const ChatBot =()=>{
    return(
        <>
        <ChatHeadlessProvider
      config={{
        apiKey: "7fb3fa694baea996017661b8b26abaaf",
        botId: "test",
        saveToSessionStorage: false,
        apiDomain:"sbx-cdn.yextapis.com"


      }}
    >
      <ChatPopUp title={"chat bot"}/>

      </ChatHeadlessProvider>
        </>
    )

}

export default ChatBot