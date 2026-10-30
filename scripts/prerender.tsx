import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import App from "../src/App";

const distDir = path.resolve(process.cwd(), "dist");
const indexPath = path.join(distDir, "index.html");

if (fs.existsSync(indexPath)) {
  const template = fs.readFileSync(indexPath, "utf-8");
  const appHtml = renderToString(<App />);
  const htmlComConteudo = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );
  fs.writeFileSync(indexPath, htmlComConteudo, "utf-8");

  // Gera também dist/agenda/index.html e dist/privacidade/index.html estáticos
  const agendaDir = path.join(distDir, "agenda");
  fs.mkdirSync(agendaDir, { recursive: true });
  fs.writeFileSync(
    path.join(agendaDir, "index.html"),
    htmlComConteudo,
    "utf-8"
  );

  const privacidadeDir = path.join(distDir, "privacidade");
  fs.mkdirSync(privacidadeDir, { recursive: true });
  fs.writeFileSync(
    path.join(privacidadeDir, "index.html"),
    htmlComConteudo,
    "utf-8"
  );

  const jogoDir = path.join(distDir, "jogo");
  fs.mkdirSync(jogoDir, { recursive: true });
  fs.writeFileSync(
    path.join(jogoDir, "index.html"),
    htmlComConteudo,
    "utf-8"
  );

  // Gera 404.html para compatibilidade total com GitHub Pages
  fs.writeFileSync(
    path.join(distDir, "404.html"),
    htmlComConteudo,
    "utf-8"
  );

  console.log("[prerender] HTML estático gerado em dist/index.html, dist/404.html, dist/agenda/index.html, dist/privacidade/index.html e dist/jogo/index.html");
}
