import { buildMenu } from "./build/menu";
import "./content-script.css";

const body = document.querySelector("body");
const menu = buildMenu();

if (body) {
  body.appendChild(menu);
}

const handleMenu = () => {
  if (menu.classList.contains("taby-display")) {
    menu.classList.remove("taby-display");
  } else {
    menu.classList.add("taby-display");
  }
};

chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.type === "TOGGLE_MENU") {
    handleMenu();
  }
});
