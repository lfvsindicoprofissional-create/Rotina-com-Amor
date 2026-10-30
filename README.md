# Rotina com Carinho — Landing Page Oficial

Landing page estática de página única (em português do Brasil) para o quadro visual semanal **Rotina com Carinho**, com foco em conversão direta para atendimento pelo **WhatsApp**.

---

## 1. Como rodar o projeto localmente

Certifique-se de ter o **Node.js** instalado (versão 18 ou superior).

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento (http://localhost:3000)
npm run dev

# 3. Gerar a versão final estática para publicação (pasta dist/)
npm run build

# 4. Visualizar o build estático localmente
npm run preview
```

---

## 2. Como editar textos, contatos e perguntas frequentes (`src/data/site.ts`)

**Toda a configuração e os textos da página estão concentrados em um único arquivo:**

👉 **`src/data/site.ts`**

Você não precisa mexer nos componentes visuais (`src/components/`) para atualizar informações da marca.

### Tabela de campos `[PREENCHER]` pendentes antes do lançamento

| O que preencher | Onde fica em `src/data/site.ts` | Formato / Exemplo |
|---|---|---|
| **Número do WhatsApp** | `site.contato.whatsappNumero` | Apenas números com código do país (`55`) + DDD + telefone. Ex.: `"5515999999999"` |
| **Número do WhatsApp (exibição no rodapé)** | `site.contato.whatsappNumeroExibicao` | Ex.: `"(15) 99999-9999"` |
| **E-mail de contato** | `site.contato.email` | Ex.: `"contato@rotinacomcarinho.com.br"` |
| **Instagram** | `site.contato.instagram` | URL completa. Ex.: `"https://instagram.com/rotinacomcarinho"` |
| **Outras redes sociais (opcional)** | `site.contato.outrasRedes` | Lista de `{ nome, url }` |
| **Logo da marca (opcional)** | `site.marca.logo` | Coloque o arquivo em `public/logo.svg` e use `"/logo.svg"` (ou mantenha `null` para exibir o nome em texto) |
| **Foto do Hero (produto em uso)** | `site.hero.imagem.src` e `alt` | Recomendado `1200×900px` (proporção 4:3) |
| **Foto principal do quadro completo** | `site.produto.imagemPrincipal.src` e `alt` | Recomendado `1600×900px` (proporção 16:9) |
| **Fotos de detalhe dos cartões (3 fotos)** | `site.produto.detalhes[0..2]` | Recomendado `800×600px` (proporção 4:3) |
| **FAQ: Opções de personalização** | `site.faq[1].complementar` | Defina o texto sobre personalização ou `null` quando incorporado na resposta principal |
| **FAQ: Quais cartões acompanham o quadro** | `site.faq[2].resposta` | Liste os cartões incluídos no kit padrão |
| **FAQ: Como limpar e conservar** | `site.faq[3].resposta` | Informe o material do quadro/cartões e como higienizar |
| **FAQ: Como funciona a entrega** | `site.faq[4].resposta` | Informe regiões atendidas, prazos e formas de envio |
| **CNPJ (opcional)** | `site.rodape.cnpj` | Ex.: `"00.000.000/0001-00"` |
| **Domínio final do site** | `site.seo.url` | Ex.: `"https://rotinacomcarinho.com.br"` |
| **Imagem de compartilhamento (Open Graph)** | `public/og-image.svg` / `site.seo.ogImage` | Recomendado `1200×630px` |
| **Política de Privacidade** | `site.privacidade.atualizacao` e `site.privacidade.blocosPreencher` | Preencher com os dados jurídicos da marca (LGPD) |
| **Ocultar avisos tracejados das fotos** | `site.mostrarAvisosPlaceholderMidia` | Mude de `true` para `false` após substituir as imagens ilustrativas pelas fotos reais |

---

## 3. Como trocar as fotos do produto

1. Coloque suas fotos otimizadas (de preferência nos formatos `.webp` ou `.jpg`) dentro da pasta **`public/img/`**.
2. Tamanhos recomendados:
   - **Hero (quadro em uso):** `1200×900px` (4:3)
   - **Quadro completo:** `1600×900px` (16:9)
   - **Detalhes dos cartões:** `800×600px` (4:3)
3. Abra `src/data/site.ts` e atualize o caminho `src` (ex.: `"/img/minha-foto-quadro.webp"`) e o texto alternativo `alt` descrevendo claramente a imagem em português para leitores de tela.
4. Altere `mostrarAvisosPlaceholderMidia: false` no topo de `src/data/site.ts` para remover as etiquetas tracejadas de `[PREENCHER]` abaixo das fotos.

---

## 4. Como publicar no GitHub Pages

O projeto já está 100% configurado para o **GitHub Pages**:
- O arquivo `.github/workflows/deploy.yml` compila e publica automaticamente o site a cada `git push` na branch `main`.
- Rotas SPA protegidas com `404.html` fallback e pré-renderização estática de rotas (`/`, `/jogo`, `/agenda`, `/privacidade`).
- Base relativa (`./`) configurada no `vite.config.ts`.

### Passo a passo para subir ao GitHub:
```bash
# 1. Vincular ao seu repositório remoto (substitua pelo seu link do GitHub)
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git

# 2. Enviar para o GitHub
git branch -M main
git push -u origin main
```

Após o envio, no GitHub acesse:
**Settings > Pages > Build and deployment > Source** e certifique-se de selecionar **GitHub Actions**. O workflow irá compilar e publicar automaticamente!
