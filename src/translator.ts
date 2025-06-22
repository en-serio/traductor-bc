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
    indicatorError("La API de traducción no está disponible.");
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
      indicatorError("La API no está disponible para estos idiomas.");
      return;
    }

    translator = await (window as any).Translator.create({
      sourceLanguage: sourceValue,
      targetLanguage: targetValue,
      monitor(m: any) {
        m.addEventListener("downloadprogress", (e: any) => {
          const porcentaje = Math.round(e.loaded * 100);
          console.log(`Descargando modelo... ${porcentaje}%`);
        });
      },
    });
    indicatorAvailable("Traductor listo.");
  } catch (error) {
    console.error("Error al cargar el traductor:", error);
    indicatorError("No se pudo inicializar el traductor.");
  }
}

export async function translateText(source: string): Promise<string> {
  if (!translator) {
    indicatorError(
      "Traductor no cargado. Por favor, carga el traductor primero."
    );
    return "";
  }
  try {
    const resultado = await translator.translate(source);
    if (!resultado) {
      throw new Error("No se pudo obtener la traducción.");
    }
    return resultado;
  } catch (err) {
    console.error("Error al traducir:", err);
    indicatorError("Error al traducir el texto.");
    return "";
  }
}

export function getTranslator() {
  if (!translator) {
    // throw new Error(
    //   "Traductor no cargado. Por favor, carga el traductor primero."
    // );
    return null;
  }
  return translator;
}
