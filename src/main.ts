import "./style.css";
import { createSelectors } from "./selectors";
import { registerEvents } from "./events";
import { checkTranslatorAPI } from "./translator";

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired");
  const sourceContainer = document.getElementById("source-selector")!;
  const targetContainer = document.getElementById("target-selector")!;
  checkTranslatorAPI();
  createSelectors(sourceContainer, targetContainer, checkTranslatorAPI);
  registerEvents();
});
