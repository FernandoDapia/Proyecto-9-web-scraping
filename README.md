# 🔥 Proyecto 9 - Web Scraping: Chollometro

Web scraping con Puppeteer a Chollometro. El proyecto permite buscar cualquier producto desde un frontend, recorre todas las páginas de resultados automáticamente y devuelve título, precio e imagen de cada chollo. Los datos se guardan en un archivo `.json` con el nombre de la búsqueda.

---

## 🚀 Tecnologías utilizadas

- Node.js + Express
- Puppeteer (web scraping con navegador real)
- fs (generación de archivos JSON)
- cors, nodemon

---

## 📁 Estructura del proyecto

```
PROYECTO-9-WEB-SCRAPPING/
├── back/
│   ├── index.js
│   ├── package.json
│   └── src/
│       ├── scrapper/
│       │   └── scrapper.js
│       └── controllers/
│           └── funcionPalabra.js
└── front/
    ├── index.html
    ├── index.js
    └── styles.css
```

---

## ⚙️ Instalación y uso

1. Clona el repositorio
2. Entra en la carpeta del backend:
   ```bash
   cd back
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor:
   ```bash
   npm run dev
   ```
5. Abre el navegador en:
   ```
   http://localhost:3000
   ```

---

## 📜 Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| `start` | `node index.js` | Arranca el servidor en producción |
| `dev` | `nodemon index.js` | Arranca el servidor en desarrollo con hot reload |
| `scrape` | `node src/scrapper/scrapper.js` | Ejecuta el scrapper directamente desde terminal |

Para ejecutar el scrapper desde terminal con una palabra clave:

```bash
npm run scrape -- macbook
npm run scrape -- iphone
npm run scrape -- televisor
```

> nodemon está configurado para ignorar los archivos `.json` generados y no reiniciar el servidor innecesariamente.

---

## 🔗 Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/v1/productos/:palabra` | Busca en Chollometro y devuelve todos los productos de todas las páginas |

### Respuesta de ejemplo

```json
[
  {
    "titleWeb": "MacBook Air 13 M5 24GB 1TB",
    "imageWeb": "https://static.chollometro.com/threads/raw/KDA7q/...",
    "priceWeb": "1.358,98€"
  },
  {
    "titleWeb": "Apple MacBook AIR 15\" M5 16GB 512GB Midnight",
    "imageWeb": "https://static.chollometro.com/threads/raw/It9Rg/...",
    "priceWeb": "1.199€"
  }
]
```

---

## 🕷️ Funcionamiento del scrapper

1. Abre un navegador real con Puppeteer y navega a `https://www.chollometro.com/`
2. Acepta el modal de cookies automáticamente si aparece
3. Escribe la palabra buscada en el buscador y pulsa Enter
4. Marca el checkbox **"Ocultar expirados"** para mostrar solo chollos activos
5. Recorre **todas las páginas** de resultados paginando automáticamente
6. De cada producto extrae: **título**, **precio** e **imagen**
7. Al finalizar genera un archivo `{palabra}.json` con todos los datos recogidos

---

## 📦 Datos recogidos por producto

| Campo | Tipo | Descripción |
|---|---|---|
| `titleWeb` | String | Nombre del producto |
| `imageWeb` | String | URL de la imagen del producto |
| `priceWeb` | String \| null | Precio del chollo (`null` si no está disponible) |

---

## 🗂️ Archivos JSON generados

Cada búsqueda genera automáticamente un archivo JSON en la raíz de `back/` con el nombre de la búsqueda:

```
back/
├── macbook.json
├── iphone.json
└── televisor.json
```

---

## 🌐 Frontend

El frontend se sirve estáticamente desde Express en `http://localhost:3000`. Permite al usuario escribir una búsqueda, lanza la petición al backend y muestra los resultados en cards con imagen, título y precio. También es posible buscar pulsando la tecla **Enter**.