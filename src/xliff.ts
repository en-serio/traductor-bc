import type { XliffUnit, XliffOptions } from "./types";
import { getTranslator } from "./translator";
import { indicatorError } from "./indicator";

const xliffUnits = document.getElementById("xliff-units-body")!;
let keepOld: Boolean = false;

export async function parseXliffToJSON(
  xliffText: string
): Promise<XliffUnit[]> {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xliffText, "text/xml");

  const transUnits = xmlDoc.getElementsByTagName("trans-unit");
  const result: XliffUnit[] = [];

  for (let i = 0; i < transUnits.length; i++) {
    const unit = transUnits[i];

    const id = unit.getAttribute("id") ?? "";
    const source = unit.getElementsByTagName("source")[0]?.textContent ?? "";
    const target = unit.getElementsByTagName("target")[0]?.textContent ?? "";

    const notes = Array.from(unit.getElementsByTagName("note")).map((note) => ({
      from: note.getAttribute("from") ?? "",
      annotates: note.getAttribute("annotates") ?? "",
      priority: note.getAttribute("priority") ?? "",
      content: note.textContent?.trim() ?? "",
    }));

    // xliffUnits.appendChild(await createXliffUnit(id, source));

    result.push({ id, source, target, notes });
  }

  return result;
}

export function jsonToXliff(data: XliffUnit[], options: XliffOptions = {}) {
  const {
    sourceLang = "en-US",
    targetLang = "es-ES",
    original = "file.xlf",
  } = options;

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  let xml = `<?xml version="1.0" encoding="utf-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:tc:xliff:document:1.2 xliff-core-1.2-transitional.xsd">
  <file datatype="xml" source-language="${sourceLang}" target-language="${targetLang}" original="${escapeXml(
    original
  )}">
    <body>
      <group id="body">
`;

  for (const unit of data) {
    xml += `        <trans-unit id="${escapeXml(
      unit.id
    )}" size-unit="char" translate="yes" xml:space="preserve">
          <source>${escapeXml(unit.source)}</source>
          <target>${escapeXml(unit.target!)}</target>
`;
    for (const note of unit.notes || []) {
      xml += `          <note from="${escapeXml(
        note.from
      )}" annotates="${escapeXml(note.annotates)}" priority="${escapeXml(
        note.priority
      )}">${escapeXml(note.content || "")}</note>
`;
    }
    xml += `        </trans-unit>
`;
  }

  xml += `      </group>
    </body>
  </file>
</xliff>`;

  return xml;
}

export function mergeXliffUnits(
  sourceUnits: XliffUnit[],
  targetUnits: XliffUnit[]
): XliffUnit[] {
  const targetMap = new Map(
    targetUnits.map((unit) => [unit.id, unit.target ?? ""])
  );

  return sourceUnits.map((unit) => ({
    ...unit,
    oldTarget: targetMap.get(unit.id),
  }));
}

export async function insertXliffUnit(
  Units: XliffUnit[],
  keepOldTarget: boolean = false
): Promise<XliffUnit[]> {
  const mergedXliffUnits: XliffUnit[] = [];
  keepOld = keepOldTarget;
  xliffUnits.innerHTML = "";
  const rowPromises = Units.map((unit) =>
    unit.oldTarget
      ? createXliffUnit(unit, unit.oldTarget, mergedXliffUnits)
      : createXliffUnit(unit, undefined, mergedXliffUnits)
  );

  const rows = await Promise.all(rowPromises);

  for (const row of rows) {
    xliffUnits.appendChild(row);
  }
  return mergedXliffUnits;
}

export function autoDownloadXliff(
  xmlString: string,
  filename = "traduccion.xlf"
) {
  const blob = new Blob([xmlString], { type: "application/xliff+xml" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 1000); // Limpieza del objeto URL
}

async function createXliffUnit(
  xliffUnit: XliffUnit,
  OldTarget: string = "No implementado",
  mergedXliffUnits: XliffUnit[]
): Promise<HTMLTableRowElement> {
  let target: string = "";
  let translator = getTranslator();
  if (keepOld && OldTarget !== "No implementado") {
    target = OldTarget;
  } else {
    if (!translator) {
      indicatorError("Traductor no cargado todavía. Pulsa 'Cargar traductor'.");
    }
    target = await translator.translate(xliffUnit.source);
  }
  const unit = document.createElement("tr");
  unit.classList.add("xliff-unit");
  const idTd = document.createElement("td");
  idTd.textContent = xliffUnit.id;
  const sourceTd = document.createElement("td");
  sourceTd.textContent = xliffUnit.source;
  const oldTargetTd = document.createElement("td");
  oldTargetTd.textContent = OldTarget;
  const targetTd = document.createElement("td");
  targetTd.textContent = target;
  const auxTd = document.createElement("td");
  unit.appendChild(idTd);
  unit.appendChild(sourceTd);
  unit.appendChild(oldTargetTd);
  unit.appendChild(targetTd);
  unit.appendChild(auxTd);
  mergedXliffUnits.push({
    id: xliffUnit.id,
    source: xliffUnit.source,
    target,
    notes: xliffUnit.notes,
  });
  // unit.appendChild(create
  return unit;
}
