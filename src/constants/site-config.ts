export const siteConfig = {
  name: "GOcuotas",
  appName: "Centro de Condiciones Comerciales",
  description:
    "Consultá las alternativas comerciales disponibles para tu comercio y solicitá un cambio de plan.",
  /** URL del material de comunicación descargable. Configurable vía env, con fallback fijo. */
  materialDownloadUrl:
    process.env.NEXT_PUBLIC_MATERIAL_DOWNLOAD_URL ??
    "https://gocuotas.com/material-comunicacion",
  processingWindowHours: 72,
} as const;
