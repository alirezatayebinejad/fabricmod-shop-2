"use client";

import { usePathname } from "next/navigation";
import { getScreenWidth } from "@/utils/getScreen";
import { useEffect } from "react";
import Script from "next/script";

export default function GoftinoWidget() {
  const pathname = usePathname();

  useEffect(() => {
    const hideWidget = () => {
      const widgetIcon = document.getElementById("goftino_w");

      if (widgetIcon) {
        widgetIcon.style.display = "none";
        widgetIcon.style.visibility = "hidden";
        widgetIcon.style.opacity = "0";
        return true; // Found and hidden
      }
      return false; // Not found yet
    };

    const showWidget = () => {
      const widgetIcon = document.getElementById("goftino_w");
      if (widgetIcon) {
        widgetIcon.style.display = "";
        widgetIcon.style.visibility = "";
        widgetIcon.style.opacity = "";
      }
    };

    if (pathname.startsWith("/panel")) {
      // Try to hide immediately in case it already exists
      if (!hideWidget()) {
        // If not found, check periodically using requestIdleCallback
        const checkForWidget = () => {
          if (hideWidget()) {
            return; // Found and hidden, stop checking
          }
          // Schedule next check during idle time
          if (window.requestIdleCallback) {
            window.requestIdleCallback(checkForWidget);
          } else {
            // Fallback for browsers that don't support requestIdleCallback
            setTimeout(checkForWidget, 100);
          }
        };

        // Start checking
        checkForWidget();
      }

      // Also listen for the goftino_ready event
      const handleGoftinoReady = () => {
        hideWidget();
      };

      window.addEventListener("goftino_ready", handleGoftinoReady);

      return () => {
        window.removeEventListener("goftino_ready", handleGoftinoReady);
      };
    } else {
      showWidget();
    }
  }, [pathname]);

  return (
    <>
      <Script
        id="goftino"
        className="goftino-hidden"
        dangerouslySetInnerHTML={{
          __html: `!function(){var i="4Hv0e4",a=window,d=document;function g(){var g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);g.async=!0,g.src=l?s+"?o="+l:s;d.getElementsByTagName("head")[0].appendChild(g);}"complete"===d.readyState?g():a.attachEvent?a.attachEvent("onload",g):a.addEventListener("load",g,!1);}();${
            getScreenWidth() < 600
              ? `window.addEventListener('goftino_ready', function () {
                Goftino.setWidget({
                  marginRight: 20,
                  marginBottom: 70
                });
              });`
              : ""
          }`,
        }}
      />
    </>
  );
}
