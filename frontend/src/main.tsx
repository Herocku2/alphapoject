import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'regenerator-runtime/runtime'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json"
import es from "./locales/es/translation.json"

import { ErrorBoundary } from "react-error-boundary";

// Unregister any service workers during development to avoid blank pages due to cached assets
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().catch(() => {});
    }
  }).catch(() => {});
}


function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.


  return (
    <div role="alert " className="p-4">
      <p>La aplicación ha tenido un error inesperado en tu dispositivo, actualiza tu navegador en la app store (iOs) o play store (Android)
        y envia este capture a soporte para resolver tu caso con los desarrolladores. </p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}


i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      // en: {
      //   translation: en
      // },
      es: {
        translation: es
      }
    },
    lng: localStorage.getItem("language") || "es", // if you're using a language detector, do not define the lng option
    fallbackLng: localStorage.getItem("language") || "es",
    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <ErrorBoundary
      fallbackRender={fallbackRender}
      onReset={(details) => {
        // Reset the state of your app so the error doesn't happen again
      }}
    >
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
