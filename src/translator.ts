import {
  indicatorAvailable,
  indicatorAwait,
  indicatorError,
} from "./indicator";

let translator: any = null;

export async function checkTranslatorAPI() {
  indicatorAwait();
  const source = document.getElementById("source-select") as HTMLSelectElement;
  const sourceValue = source?.value || "es";
  console.log(sourceValue);
  const target = document.getElementById("target-select") as HTMLSelectElement;
  const targetValue = target?.value || "en";
  console.log(targetValue);
  if (!("Translator" in window)) {
    indicatorError("The translator API is not available in this browser.");
    return;
  }
  try {
    const translatorCapabilities = await (
      window as any
    ).Translator.availability({
      sourceLanguage: sourceValue,
      targetLanguage: targetValue,
    });

    if (translatorCapabilities === "unavailable") {
      indicatorError(
        "The translator is not available for the selected languages."
      );
      return;
    }

    translator = await (window as any).Translator.create({
      sourceLanguage: sourceValue,
      targetLanguage: targetValue,
      monitor(m: any) {
        m.addEventListener("downloadprogress", (e: any) => {
          const percent = Math.round(e.loaded * 100);
          console.log(`Downloading model ${percent}%`);
        });
      },
    });
    indicatorAvailable("Translator reeady.");
  } catch (error) {
    console.error("Error loading translator:", error);
    indicatorError("The translator could not be initialized.");
  }
}

export async function translateText(source: string): Promise<string> {
  if (!translator) {
    indicatorError("Translator not loaded. Please load the translator first.");
    return "";
  }
  try {
    const resultado = await translator.translate(source);
    if (!resultado) {
      throw new Error("The translation could not be obtained.");
    }
    return resultado;
  } catch (err) {
    console.error("Error translatign:", err);
    indicatorError("Error translating the text.");
    return "";
  }
}

export function getTranslator() {
  if (!translator) {
    // throw new Error(
    //   "🥰"
    // );
    return null;
  }
  return translator;
}
