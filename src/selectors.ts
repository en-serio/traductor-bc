import { languages } from "./languages";

let lastSource: string = "es";
let lastTarget: string = "en";

export function createSelectors(
  sourceContainer: HTMLElement,
  targetContainer: HTMLElement,
  onChange: () => void,
  defaultSource: string = "es",
  defaultTarget: string = "en"
) {
  const sourceSelect = Createselect(defaultSource);
  sourceSelect.id = "source-select";
  sourceSelect.classList.add("lang-select");
  sourceSelect.value = "es";
  sourceSelect.addEventListener("change", () => {
    if (sourceSelect.value === targetSelect.value) {
      targetSelect.value = lastSource;
      lastTarget = lastSource;
    }
    onChange;
    lastSource = sourceSelect.value;
  });

  const targetSelect = Createselect(defaultTarget);
  targetSelect.id = "target-select";
  targetSelect.classList.add("lang-select");
  targetSelect.value = "en";
  targetSelect.addEventListener("change", () => {
    if (sourceSelect.value === targetSelect.value) {
      sourceSelect.value = lastTarget;
      lastSource = lastTarget;
    }
    onChange;
    lastTarget = targetSelect.value;
  });

  sourceContainer.appendChild(sourceSelect);
  targetContainer.appendChild(targetSelect);
}

export function Createselect(selected: string = "en"): HTMLSelectElement {
  const selector = document.createElement("select");
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang.code;
    option.classList.add("lang-option");
    option.textContent = lang.name;
    selector.appendChild(option);
  });
  return selector;
}
