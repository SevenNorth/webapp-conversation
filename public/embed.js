/** this file is used to embed the chatbot in a website
 * the difyChatbotConfig should be defined in the html file before this script is included
 * the difyChatbotConfig should contain the token of the chatbot
 * the token can be found in the chatbot settings page
 */

// attention: This JavaScript script must be placed after the <body> element. Otherwise, the script will not work.

(function () {
  // Constants for DOM element IDs and configuration key
  const configKey = "difyChatbotConfig";
  const buttonId = "dify-chatbot-bubble-button";
  const iframeId = "dify-chatbot-bubble-window";
  const config = window[configKey];

  // SVG icons for open and close states
  const svgIcons = {
    open: `<img src="${config.baseUrl}/icon.png" style="height: 100%;width: 100%;border-radius: 50%;" />`,
    close: `<svg id="closeIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 18L6 6M6 18L18 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  };

  // Main function to embed the chatbot
  async function embedChatbot() {
    if (!config) {
      console.error(`${configKey} is empty or token is not provided`);
      return;
    }

    const params = new URLSearchParams(config.params);

    const baseUrl =
      config.baseUrl || `https://${config.isDev ? "dev." : ""}udify.app`;

    // pre-check the length of the URL
    const iframeUrl = `${baseUrl}/?${params}`;
    if (iframeUrl.length > 2048) {
      console.error("The URL is too long, please reduce the number of inputs to prevent the bot from failing to load");
    }

    // Function to create the iframe for the chatbot
    function createIframe() {
      const iframe = document.createElement("iframe");
      iframe.allow = "fullscreen;microphone";
      iframe.title = "chatbot bubble window";
      iframe.id = iframeId;
      iframe.src = iframeUrl;
      iframe.style.cssText = `
        border: none; position: absolute; flex-direction: column; justify-content: space-between;
        box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, rgba(150, 150, 150, 0.2) 0px 0px 0px 1px;
        bottom: 55px; right: 0; width: 24rem; max-width: calc(100vw - 2rem); height: 40rem;
        max-height: calc(100vh - 6rem); border-radius: 0.75rem; display: flex; z-index: 2147483647;
        overflow: hidden; left: unset; background-color: #F3F4F6;user-select: none;
      `;

      return iframe;
    }

    // Function to reset the iframe position
    function resetIframePosition() {
      if (window.innerWidth <= 640)
        return

      const targetIframe = document.getElementById(iframeId);
      const targetButton = document.getElementById(buttonId);
      if (targetIframe && targetButton) {
        const buttonRect = targetButton.getBoundingClientRect();

        const buttonInBottom = buttonRect.top - 5 > targetIframe.clientHeight

        if (buttonInBottom) {
          targetIframe.style.bottom = `${buttonRect.height + 5}px`;
          targetIframe.style.top = 'unset';
        }
        else {
          targetIframe.style.bottom = 'unset';
          targetIframe.style.top = `${buttonRect.height + 5}px`;
        }

        const buttonInRight = buttonRect.right > targetIframe.clientWidth;

        if (buttonInRight) {
          targetIframe.style.right = '0';
          targetIframe.style.left = 'unset';
        }
        else {
          targetIframe.style.right = 'unset';
          targetIframe.style.left = 0;
        }
      }
    }

    // Function to create the chat button
    function createButton() {
      const containerDiv = document.createElement("div");
      // Apply custom properties from config
      Object.entries(config.containerProps || {}).forEach(([key, value]) => {
        if (key === "className") {
          containerDiv.classList.add(...value.split(" "));
        } else if (key === "style") {
          if (typeof value === "object") {
            Object.assign(containerDiv.style, value);
          } else {
            containerDiv.style.cssText = value;
          }
        } else if (typeof value === "function") {
          containerDiv.addEventListener(
            key.replace(/^on/, "").toLowerCase(),
            value
          );
        } else {
          containerDiv[key] = value;
        }
      });

      containerDiv.id = buttonId;

      // Add styles for the button
      const styleSheet = document.createElement("style");
      document.head.appendChild(styleSheet);
      styleSheet.sheet.insertRule(`
        #${containerDiv.id} {
          position: fixed;
          bottom: var(--${containerDiv.id}-bottom, 1rem);
          right: var(--${containerDiv.id}-right, 1rem);
          left: var(--${containerDiv.id}-left, unset);
          top: var(--${containerDiv.id}-top, unset);
          width: var(--${containerDiv.id}-width, 50px);
          height: var(--${containerDiv.id}-height, 50px);
          border-radius: var(--${containerDiv.id}-border-radius, 25px);
          background-color: var(--${containerDiv.id}-bg-color, #155EEF);
          box-shadow: var(--${containerDiv.id}-box-shadow, rgba(0, 0, 0, 0.2) 0px 4px 8px 0px);
          cursor: pointer;
          z-index: 2147483647;
        }
      `);

      // Create display div for the button icon
      const displayDiv = document.createElement("div");
      displayDiv.style.cssText =
        "display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; z-index: 2147483647;";
      displayDiv.innerHTML = svgIcons.open;
      containerDiv.appendChild(displayDiv);
      document.body.appendChild(containerDiv);

      // Add click event listener to toggle chatbot
      containerDiv.addEventListener("click", function () {
        const targetIframe = document.getElementById(iframeId);
        if (!targetIframe) {
          containerDiv.appendChild(createIframe());
          resetIframePosition();
          this.title = "Exit (ESC)";
          displayDiv.innerHTML = svgIcons.close;
          document.addEventListener('keydown', handleEscKey);
          return;
        }
        targetIframe.style.display = targetIframe.style.display === "none" ? "block" : "none";
        displayDiv.innerHTML = targetIframe.style.display === "none" ? svgIcons.open : svgIcons.close;

        if (targetIframe.style.display === "none") {
          document.removeEventListener('keydown', handleEscKey);
        } else {
          document.addEventListener('keydown', handleEscKey);
        }


        resetIframePosition();
      });

      // Enable dragging if specified in config
      if (config.draggable) {
        enableDragging(containerDiv, config.dragAxis || "both");
      }
    }

    // Function to enable dragging of the chat button
    function enableDragging(element, axis) {
      let isDragging = false;
      let startX, startY;

      element.addEventListener("mousedown", startDragging);
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", stopDragging);
      // element.addEventListener("touchstart", startDragging);
      // document.addEventListener("touchmove", drag);
      // document.addEventListener("touchend", stopDragging);

      function startDragging(e) {
        isDragging = true;
        startX = e.clientX - element.offsetLeft;
        startY = e.clientY - element.offsetTop;
      }

      function drag(e) {
        if (!isDragging) return;

        element.style.transition = "none";
        element.style.cursor = "grabbing";

        // Hide iframe while dragging
        const targetIframe = document.getElementById(iframeId);
        if (targetIframe) {
          targetIframe.style.display = "none";
          element.querySelector("div").innerHTML = svgIcons.open;
        }

        const newLeft = e.clientX - startX;
        const newBottom = window.innerHeight - e.clientY - startY;

        const elementRect = element.getBoundingClientRect();
        const maxX = window.innerWidth - elementRect.width;
        const maxY = window.innerHeight - elementRect.height;

        // Update position based on drag axis
        if (axis === "x" || axis === "both") {
          element.style.setProperty(
            `--${buttonId}-left`,
            `${Math.max(0, Math.min(newLeft, maxX))}px`
          );
        }

        if (axis === "y" || axis === "both") {
          element.style.setProperty(
            `--${buttonId}-bottom`,
            `${Math.max(0, Math.min(newBottom, maxY))}px`
          );
        }
      }

      function stopDragging() {
        isDragging = false;
        element.style.transition = "";
        element.style.cursor = "pointer";
      }
    }

    // Create the chat button if it doesn't exist
    if (!document.getElementById(buttonId)) {
      createButton();
    }
  }

  // Add esc Exit keyboard event triggered
  function handleEscKey(event) {
    if (event.key === 'Escape') {
      const targetIframe = document.getElementById(iframeId);
      const button = document.getElementById(buttonId);
      if (targetIframe && targetIframe.style.display !== 'none') {
        targetIframe.style.display = 'none';
        button.querySelector('div').innerHTML = svgIcons.open;
      }
    }
  }
  document.addEventListener('keydown', handleEscKey);

  // Set the embedChatbot function to run when the body is loaded,Avoid infinite nesting
  if (config?.dynamicScript) {
    embedChatbot();
  } else {
    document.body.onload = embedChatbot;
  }
})();