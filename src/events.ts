import { checkTranslatorAPI, getTranslator, translateText } from "./translator";
import { indicatorAwait, indicatorError } from "./indicator";
import {
  parseXliffToJSON,
  insertXliffUnit,
  mergeXliffUnits,
  autoDownloadXliff,
  jsonToXliff,
} from "./xliff";
import type { XliffUnit } from "./types";
import { readFileAsText } from "./files";

let keepOldTarget: boolean = false;
let mergedXliffUnits: XliffUnit[] = [];

export function registerEvents() {
  document.getElementById("load-translator")?.addEventListener("click", () => {
    checkTranslatorAPI();
  });

  document.getElementById("translate")!.addEventListener("click", async () => {
    checkTranslatorAPI();

    const input = document.getElementById("source-text") as HTMLInputElement;
    const sourceText = input?.value || "";
    console.log(sourceText);
    if (!sourceText) {
      // TODO english
      console.warn("There is no text to translate.");
      return;
    }
    try {
      const resultado = await translateText(sourceText);
      document.getElementById("target-text")!.textContent = resultado;
    } catch (err) {
      // TODO english
      console.error("Translation error:", err);
      indicatorError("An error occurred while translating the text.");
    }
  });

  document.querySelectorAll('input[name="type-input"]').forEach((input) =>
    input.addEventListener("change", (event) => {
      const selected = (event.target as HTMLInputElement).value;
      document
        .querySelector("#source-text-container")
        ?.classList.toggle("hidden", selected !== "text");
      document
        .querySelector("#source-input-container")
        ?.classList.toggle("hidden", selected !== "xliff");
      document
        .querySelector("#source-json-container")
        ?.classList.toggle("hidden", selected !== "json");
    })
  );

  document.querySelectorAll('input[name="translate-action"]').forEach((input) =>
    input.addEventListener("change", (event) => {
      keepOldTarget = (event.target as HTMLInputElement).value === "YES";
    })
  );

  document
    .getElementById("translate-file")
    ?.addEventListener("click", async () => {
      const fileInput = document.getElementById(
        "source-file"
      ) as HTMLInputElement;
      const file = fileInput?.files?.[0];

      const targetFileInput = document.getElementById(
        "target-file"
      ) as HTMLInputElement;
      const targetFile = targetFileInput?.files?.[0];

      if (!file) {
        indicatorError("Select an XLIFF file before translating.");
        return;
      }

      if (!file.name.endsWith(".xliff") && !file.name.endsWith(".xlf")) {
        indicatorError("The file is not a valid XLIFF (.xliff or .xlf)");
        return;
      }

      try {
        const content = await readFileAsText(file);
        const parsed = await parseXliffToJSON(content);
        if (targetFile) {
          const targetContent = await readFileAsText(targetFile);
          const parsedTarget = await parseXliffToJSON(targetContent);
          const merged = mergeXliffUnits(parsed, parsedTarget);
          mergedXliffUnits = await insertXliffUnit(merged, keepOldTarget);
        } else {
          mergedXliffUnits = await insertXliffUnit(parsed, keepOldTarget);
        }
      } catch (err) {
        console.error("Error reading the file", err);
        alert("The file could not be read.");
      }
    });

  document.getElementById("download-file")?.addEventListener("click", () => {
    const xliffParsed = jsonToXliff(mergedXliffUnits);
    //Todo rename the output file
    autoDownloadXliff(xliffParsed, "translated.xlf");
  });

  document.getElementById("swap-languages")?.addEventListener("click", () => {
    const sourceSelect = document.getElementById(
      "source-select"
    ) as HTMLSelectElement;
    const targetSelect = document.getElementById(
      "target-select"
    ) as HTMLSelectElement;
    const tempValue = sourceSelect.value;
    sourceSelect.value = targetSelect.value;
    targetSelect.value = tempValue;
    indicatorAwait();
    checkTranslatorAPI();
  });
}
