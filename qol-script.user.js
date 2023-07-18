// ==UserScript==
// @name         InvDude Colab QOL for VladmandicColab
// @namespace    inv_vladmandic
// @version      v1.0.0
// @description  Change custom-urls from input to textarea in my colab, and many more...
// @author       InvDude
// @match        https://colab.research.google.com/github/InvincibleDude/vladmandic-colab/blob/master/InvincibleDudes_Vladmandic_Colab.ipynb
// @match        https://huggingface.co/*/tree/*
// @match        https://civitai.com/*
// @icon         https://cdn.discordapp.com/emojis/1018761004487802961.webp?size=96&quality=lossless
// @grant        GM_setValue
// @grant        GM_getValue
// @license      WTFPL
// ==/UserScript==

const STYLE =  `
  textarea#vladmandic-qol, input#vladmandic-qol-huggingface {
    width: 100%;
    background-color: #040e17;
    color: #0cd189;
    border-radius: 5px;
    border-width: 1px;
    border-color: gray;
    padding: 8px;
    margin-inline: 5px;
    resize: vertical;
  }
  textarea#vladmandic-qol::placeholder, input#vladmandic-qol-huggingface::placeholder {
    color: #3bd7ffcc;
  }

  textarea#vladmandic-qol:focus, input#vladmandic-qol-huggingface:focus {
    outline: none;
    border-color: #0cd189;
    border-width: 1.5px;
  }

  div#vladmandic-container > div > button, #vladmandic-qol-huggingface  {
    background-color: #040e17;
    border-radius: 3px;
    border-style: solid;
    border-color: #0cd189;
    border-width: 1.5px;
    color: #0cd189;
    cursor: pointer;
    margin: 0;
    outline: none;
    padding: 5px 8px;
    text-decoration: none;
    vertical-align: baseline;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

`;


(function () {
  // if url start with huggingface

  function makeButton() {
    let button = document.createElement("button");
    button.innerText = "+";
    button.style = `

          background-color: #040e17;
          border-radius: 3px;
          border-style: solid;
          border-color: #3bd7ff;
          border-width: 1.5px;
          color: #3bd7ff;
          cursor: pointer;
          outline: none;
          padding: 2px 9px;
          text-decoration: none;
          vertical-align: baseline;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          width: 30px;
          z-index: 999;
          `;
    return button;
  }

  async function addLink(link) {
    let curr = await GM_getValue("vladmandic-qol", "");
    if (curr.indexOf(link) !== -1) {
      alert("Already exists");
      return;
    }

    curr += curr === "" ? link : ", " + link;
    await GM_setValue("vladmandic-qol", curr);
  }

  if (window.location.origin == "https://huggingface.co") {
    setTimeout(() => {
      let links = [];
      let elements = document.querySelectorAll("a");
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].href.indexOf("/resolve/") !== -1)
          if (
            elements[i].href.indexOf(".ckpt") !== -1 ||
            elements[i].href.indexOf(".safetensors") !== -1 ||
            elements[i].href.indexOf(".pt") !== -1 ||
            elements[i].href.indexOf(".yaml") !== -1
          ) {
            // add a button before the element

            let button = makeButton();
            button.onclick = () => {
              addLink(elements[i].href);
            };
            //elements[i].parentNode.insertBefore(button, elements[i]);
            //elements[i].previousElementSibling.style = ""
            elements[i].previousElementSibling.appendChild(button);
          }
      }
    }, 2000);
    // if (links.length > 0) {
    //   alert(links.join(", "));
    // } else {
    //   alert("No links found.");
    // }

    return;
  }

  if (window.location.origin == "https://civitai.com") {
    setTimeout(() => {
      console.log("civit lod");
      let elements = document.querySelectorAll("a");
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].href.indexOf("/api/download/") !== -1) {
          let button = makeButton();
          button.onclick = () => {
            addLink(elements[i].href);
          };
          elements[i].parentNode.insertBefore(button, elements[i]);
        }
      }
    }, 2000);
    return;
  }

  setTimeout(() => {
    // Add everything
    function addThemAll() {
      const paperInput = document.querySelector(
        "#formwidget-23-label + div > paper-input"
      );

      const textBox = paperInput.shadowRoot.querySelector(
        "iron-input[id^='input'] > input"
      );

      // hide textbox using opacity
      textBox.style.opacity = 0;
      textBox.style.height = "0px";
      textBox.style.position = "absolute";
      textBox.style.pointerEvents = "none";

      // replace it with textarea
      let textArea = document.createElement("textarea");
      textArea.id = "vladmandic-qol";
      textArea.rows = 5;
      textArea.placeholder =
        "Enter links here. Yet another QOL feature by NoCrypt, but for my Colab";
      const style = document.createElement("style");
      style.innerHTML = STYLE;
      const originalUrls = textBox.value;
      textArea.value = originalUrls;
      // add event listener to textarea
      textArea.addEventListener("input", (e) => {
        textBox.value = e.target.value;
        textBox.dispatchEvent(new Event("input", { bubbles: true }));
        textBox.dispatchEvent(new Event("change", { bubbles: true }));
      });

      // warp textarea in a div
      let div = document.createElement("div");
      div.id = "vladmandic-container";
      div.style.width = "98%";
      div.style.display = "flex";
      div.style.flexDirection = "column";

      let div2 = document.createElement("div");
      div2.style.display = "flex";
      div2.style.gap = "5px";
      div2.style.margin = "8px";

      let status = document.createElement("span");
      status.innerText = "";

      function statusUpdate(text) {
        status.innerText = text;
        setTimeout(() => {
          status.innerText = "";
        }, 2000);
      }

      let btnSave = document.createElement("button");
      btnSave.innerText = "Save";
      btnSave.addEventListener("click", () => {
        GM_setValue("vladmandic-qol", textArea.value);

        statusUpdate("Saved to local storage");
      });

      let btnLoad = document.createElement("button");
      btnLoad.innerText = "Load";
      btnLoad.addEventListener("click", () => {
        textArea.value = GM_getValue("vladmandic-qol", "");
        textArea.dispatchEvent(new Event("input", { bubbles: true }));
        textArea.dispatchEvent(new Event("change", { bubbles: true }));

        statusUpdate("Loaded from local storage");
      });


      let btnClear = document.createElement("button");
      btnClear.innerText = "Clear";
      btnClear.addEventListener("click", () => {
        textArea.value = "";
        textArea.dispatchEvent(new Event("input", { bubbles: true }));
        textArea.dispatchEvent(new Event("change", { bubbles: true }));

        statusUpdate("Cleared");
      });

      div2.appendChild(btnLoad);
      div2.appendChild(btnSave);
      div2.appendChild(btnClear);
      div2.appendChild(status);

      if (GM_getValue("vladmandic-autoload", false)) {
        textArea.value = GM_getValue("vladmandic-qol", "");
      }
      // add textarea to the page
      div.appendChild(div2);
      div.appendChild(textArea);
      paperInput.parentNode.appendChild(style);
      paperInput.parentNode.appendChild(div);
      paperInput.classList = "";
      paperInput.nextElementSibling.style.display =
        paperInput.previousElementSibling.style.display = "none";
    }

    function addHuggingface() {
      const paperInput = document.querySelector('#formwidget-6-label + div > paper-input');
      const input = paperInput.shadowRoot.querySelector("iron-input[id^='input'] > input");


      let div = document.createElement("div");
      div.style.display = "flex";
      div.style.gap = "5px";
      div.style.margin = "8px";

      let btnLoad = document.createElement("button");
      btnLoad.id = 'vladmandic-qol-huggingface';
      btnLoad.innerText = "Load";
      btnLoad.addEventListener("click", () => {
        input.value = GM_getValue("vladmandic-qol-huggingface", "");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });

      let btnSave = document.createElement("button");
      btnSave.id = 'vladmandic-qol-huggingface';
      btnSave.innerText = "Save";
      btnSave.addEventListener("click", () => {
        GM_setValue("vladmandic-qol-huggingface", input.value);
      });

      if (GM_getValue("vladmandic-autoload", false)) {
        input.value = GM_getValue("vladmandic-qol-huggingface", "");
      }
      div.appendChild(btnLoad);
      div.appendChild(btnSave);
      paperInput.parentNode.appendChild(div);
    }

    function addAutoLoadCheckbox() {
      const toolbar = document.querySelector(".expanded-options");

      let separator = document.createElement("span");
      separator.classList.add("colab-separator");

      let checkbox = document.createElement("input");
      checkbox.type = "checkbox"
      checkbox.checked = GM_getValue("vladmandic-autoload", false);

      let label = document.createElement('label');
      label.innerText = "Autoload tokens and URLs"

      checkbox.addEventListener("change", function(e) {
      if (checkbox.checked) {
        GM_setValue("vladmandic-autoload", true);
      } else {
        GM_setValue("vladmandic-autoload", false);
      }
      });

      toolbar.appendChild(separator);
      toolbar.appendChild(checkbox);
      toolbar.appendChild(label);
      return checkbox;
    };

    // Seperated to a function due to Mutation Observer
    addThemAll();
    addHuggingface();
    const checkbox = addAutoLoadCheckbox();

    // Mutation Observer for permanent modification
    let targetNode = document.querySelector("colab-form > div");
    const config = { childList: true };
    const callback = (mutationList, observer) => {
      for (const [idx, mutation] of mutationList.entries()) {
        if (mutation.type === "childList") {
          if (mutation.removedNodes.length > 0 && idx === 0) {
            // means there was a node removed
            // check if my container still exists
            console.log("removed, adding back...");
            if (!document.getElementById("vladmandic-container")) {
              // it doesn't exist, so add it back
              addThemAll();
              addHuggingface();
            }
          }
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  }, 5000); // wait untill page finish rendering
})();
