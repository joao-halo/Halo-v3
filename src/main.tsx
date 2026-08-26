import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Elemento #root não encontrado em index.html");

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// O build pré-renderiza a página, então o container já chega com marcação:
// nesse caso hidratamos em vez de recriar a árvore do zero.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
