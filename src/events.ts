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
  document.getElementById("cargar-traductor")?.addEventListener("click", () => {
    checkTranslatorAPI();
  });

  document.getElementById("traducir")!.addEventListener("click", async () => {
    checkTranslatorAPI();

    const input = document.getElementById("source-text") as HTMLInputElement;
    const sourceText = input?.value || "";
    console.log(sourceText);
    if (!sourceText) {
      console.warn("No hay texto para traducir.");
      return;
    }
    try {
      const resultado = await translateText(sourceText);
      document.getElementById("target-text")!.textContent = resultado;
    } catch (err) {
      console.error("Error al traducir:", err);
      indicatorError("Error al traducir el texto.");
    }
  });

  document.querySelectorAll('input[name="type-input"]').forEach((input) =>
    input.addEventListener("change", (event) => {
      const selected = (event.target as HTMLInputElement).value;
      console.log("Texto seleccionado");
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

  document.querySelectorAll('input[name="trad-action"]').forEach((input) =>
    input.addEventListener("change", (event) => {
      console.log("Acción de traducción seleccionada");
      keepOldTarget = (event.target as HTMLInputElement).value === "YES";
    })
  );

  document
    .getElementById("traducir-archivo")
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
        indicatorError("Selecciona un archivo XLIFF antes de traducir.");
        return;
      }

      if (!file.name.endsWith(".xliff") && !file.name.endsWith(".xlf")) {
        indicatorError("El archivo no es un XLIFF válido (.xliff o .xlf).");
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
        console.error("Error al leer el archivo.", err);
        alert("No se pudo leer el archivo.");
      }
    });

  document
    .getElementById("descargar-archivo")
    ?.addEventListener("click", () => {
      const elXlidf = jsonToXliff(mergedXliffUnits);
      autoDownloadXliff(elXlidf, "traduccion.xlf");
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
