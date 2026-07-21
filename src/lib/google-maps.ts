const SCRIPT_ID = "google-maps-places-script";

let loadPromise: Promise<void> | null = null;

/**
 * Inyecta el script de Google Maps JS (librería Places) una sola vez.
 * Si ya se está cargando o ya cargó, reutiliza la misma promesa.
 */
export function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("loadGoogleMapsScript solo puede ejecutarse en el cliente"));
  }

  if (window.google?.maps?.places) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () => reject(new Error("No se pudo cargar Google Maps")));
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=es&region=AR`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Google Maps"));

    document.head.appendChild(script);
  });

  return loadPromise;
}
