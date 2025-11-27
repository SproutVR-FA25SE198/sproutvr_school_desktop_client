"use client";

import { useEffect } from "react";

export function DialogflowWidget() {
    useEffect(() => {
        // 1. Load CSS
        const cssUrl = "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css";
        if (!document.querySelector(`link[href="${cssUrl}"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = cssUrl;
            document.head.appendChild(link);
        }

        // 2. Load Script
        const scriptUrl = "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js";
        if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
            const script = document.createElement("script");
            script.src = scriptUrl;
            script.async = true;
            document.head.appendChild(script);
        }

        // 3. Custom Styles
        const styleId = "df-messenger-custom-style";
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.textContent = `
        df-messenger {
          z-index: 999;
          position: fixed;
          bottom: 16px;
          right: 16px;
          
          --df-messenger-chat-window-width: 450px; 
          
          --df-messenger-font-family: Arial, sans-serif; 

          --df-messenger-font-color: #000;
          --df-messenger-chat-background: #EEF7EE;
          --df-messenger-message-user-background: #C8E6C9;
          --df-messenger-message-bot-background: #fff;
        } 
      `;
            document.head.appendChild(style);
        }
    }, []);

    return (
        // @ts-ignore
        <df-messenger
            location={import.meta.env.VITE_LOCATION}
            project-id={import.meta.env.VITE_PROJECT_ID}
            agent-id={import.meta.env.VITE_AGENT_ID}
            language-code={import.meta.env.VITE_LANGUAGE}
            max-query-length="-1"
        >
            {/* @ts-ignore */}
            <df-messenger-chat-bubble
                chat-title="SproutVR Assistant"
                chat-title-icon={import.meta.env.VITE_LOGO}
            >
                {/* @ts-ignore */}
            </df-messenger-chat-bubble>
            {/* @ts-ignore */}
        </df-messenger>
    );
}