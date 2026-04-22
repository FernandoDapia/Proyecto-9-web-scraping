const { default: puppeteer } = require("puppeteer");
const fs = require("fs")

const scrapper = async (url, palabra) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);

  await page.goto(url, { waitUntil: "domcontentloaded" });
  try {
    await page.waitForSelector('[data-t="acceptAll"]', { visible: true });
    await page.evaluate(() =>
      document.querySelector('[data-t="acceptAll"]').click(),
    );
    await page
      .waitForSelector('[data-t="acceptAll"]', { hidden: true, timeout: 10000 })
      .catch(() => {});
  } catch (error) {}

  await page.waitForSelector("#input--1", { visible: true, timeout: 15000 });
  await page.type("#input--1", palabra, { delay: 80 });
  const urlActual = page.url();
  await page.keyboard.press("Enter");

  await page.waitForFunction(
    (urlAnterior) => window.location.href !== urlAnterior,
    { timeout: 30000 },
    urlActual,
  );

  await page.waitForSelector('input[name="hide_expired"]', { visible: true });
  await page.click('input[name="hide_expired"]');
  await new Promise((r) => setTimeout(r, 5000));

  const todosLosProductos = [];
  let numeroPagina = 1;

  while (true) {
    console.log(`Scrapeando pagina ${numeroPagina}...`);
    await page.waitForSelector("article.thread", {
      visible: true,
      timeout: 30000,
    });
    const productosPagina = await page.evaluate(() => {
      const articulos = document.querySelectorAll("article.thread");
      const resultados = [];

      articulos.forEach((articulo) => {
        const titleChollometro =
          articulo.querySelector("a.cept-tt") ||
          articulo.querySelector("a.thread-title--list");
        const titleWeb = titleChollometro
          ? titleChollometro.innerText.trim()
          : null;

        const imgChollometro = articulo.querySelector("span.imgFrame img");
        const imageWeb = imgChollometro
          ? imgChollometro.getAttribute("src") ||
            imgChollometro.getAttribute("data-src")
          : null;
        const priceChollometro = articulo.querySelector(".thread-price");
        const priceWeb = priceChollometro
          ? priceChollometro.innerText.trim()
          : null;
        if (imageWeb || titleWeb) {
          resultados.push({ titleWeb, imageWeb, priceWeb });
        }
      });

      return resultados;
    });
    todosLosProductos.push(...productosPagina);
    const botonSiguiente = await page.$(
      'button[aria-label="Siguiente página"]',
    );
    if (!botonSiguiente) {
      break;
    }
    try {
      await Promise.all([
        page.waitForNavigation({
          waitUntil: "domcontentloaded",
          timeout: 60000,
        }),
        botonSiguiente.click(),
      ]);
    } catch (error) {
      console.log("ultima pagina alcanzada, finalizando...");
      break;
    }

    numeroPagina++;
    await new Promise((r) => setTimeout(r, 5000));
  }
  console.log(todosLosProductos);

  fs.writeFileSync(
    `${palabra}.json`,
    JSON.stringify(todosLosProductos, null, 2),
    "utf-8",
  );
  console.log(
    `✅ ${palabra}.json guardado con`,
    todosLosProductos.length,
    "productos",
  );

  await browser.close();
  return todosLosProductos;
};

module.exports = { scrapper };

const palabra = process.argv[2]
if (palabra) {
  scrapper("https://www.chollometro.com/", palabra);
}
