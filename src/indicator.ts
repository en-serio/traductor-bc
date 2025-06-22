const indicator = document.getElementById("indicator")!;
const statusMessage = document.getElementById("status-message")!;

export function indicatorAwait() {
  indicator.classList.add("disabled");
  statusMessage.classList.remove("error");
  indicator.classList.remove("enabled", "unavailable");
  statusMessage.innerHTML = `
  <p>Translator API is ready to load.</p>
  `;
}

export function indicatorAvailable(message: string) {
  statusMessage.classList.remove("error");
  indicator.classList.add("enabled");
  indicator.classList.remove("disabled", "unavailable");
  statusMessage.innerHTML = `
  <p>${message}</p>
  `;
}

export function indicatorError(message: string) {
  indicator.classList.remove("disabled", "enabled");
  indicator.classList.add("unavailable");
  // console.error("Translator API is not available in this environment.");
  console.error(message);
  statusMessage.classList.add("error");
  statusMessage.innerHTML = `
              <p>${message}</p>
              `;
}
