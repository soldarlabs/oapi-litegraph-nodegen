/**
 * @file Main entry point for the demo application.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LiteGraphProvider } from "@/contexts/LiteGraphProvider";
import "@/index.css";
import App from "@/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <LiteGraphProvider canvasId="#graphcanvas">
        <App />
      </LiteGraphProvider>
    </ThemeProvider>
  </StrictMode>
);
