/** Global branding: sidebar team switcher, <Logo />, auth shell, metadata, etc. */
export const site = {
  /** Title next to the logo (sidebar team switcher, auth header, default document title) */
  title: "Well Labs",
  description: "Well Labs Platform — operations and admin console",
  logoLightSrc: "/logo-black.svg",
  logoDarkSrc: "/logo-white.svg",
  logoAlt: "Well Labs",
  /** Subtitle under the title in the sidebar team switcher (first team) */
  plan: "well-labs-platform",
  /** Sticky bar title next to the sidebar trigger (/ecommerce, /original, /developers shells) */
  dashboardAppTitle: {
    ecommerce: "Well Labs",
    original: "Original App",
    developers: "Developers App",
    "project-management": "Project Management",
    "payment-processor": "Payment Processor",
    todo: "Todo App",
  },
} as const;
