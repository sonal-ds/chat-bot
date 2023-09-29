import { useChatState, useChatActions } from "@yext/chat-headless-react"
import * as React from "react";

export const MyComponent = () => {
  const chat = useChatActions();
  const messages = useChatState(state => state.conversation.messages)
  return (
   
    <div>
      <ul>
        {
          messages.map(message => (
            <li>
              {message.text}
            </li>
          ))
        }
      </ul>
      <input
        onSubmit={(e => chat.getNextMessage(e.target.value))}
      />
    </div>
  
  )
}
