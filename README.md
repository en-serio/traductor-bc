# XLIFF Translator – Chrome Gemini API Demo

This project is a web-based tool to test the new Chrome Gemini translation API directly in the browser. It provides a modern UI for translating text, XLIFF files, and JSON i18n files using the experimental Gemini API available in Chrome.

## Features

- **Gemini API Integration**: Uses the new Chrome Gemini translation API (when available) for fast, local translations in the browser.
- **Text Translation**: Instantly translate single text strings between supported languages.
- **XLIFF File Support**: Upload `.xlf`/`.xliff` files for batch translation and download the translated result.
- **JSON i18n Support**: Translate i18n JSON files for app localization.
- **Language Selector**: Easily choose source and target languages.
- **Modern UI**: Built with Vite, TypeScript, and Tailwind CSS for a responsive, user-friendly experience.

## Getting Started

### Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
3. **Open the app:**
   Visit [http://localhost:5173](http://localhost:5173) in Chrome 138.

## Usage

- Select the input type: Text, XLIFF, or JSON.
- Choose source and target languages.
- For text, enter your string and click **Translate**.
- For files, upload your source (and optionally target) file, then click **Translate file**.
- Download the translated file if needed.

> **Note:** The Gemini API is experimental and only available in certain Chrome versions. If unavailable, the app will show an error.

## Project Structure

- `src/` – TypeScript source files
- `index.html` – Main HTML file
- `public/` – Static assets
- `vite.config.ts` – Vite configuration
- `tailwind.config.js` – Tailwind CSS config (if present)

## License

MIT

## TODO
Add aria attributes.
Add JSon support
add xliff note support