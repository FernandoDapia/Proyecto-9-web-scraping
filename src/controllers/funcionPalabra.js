const { scrapper } = require("../scrapper/scrapper");

const funcionPalabra = async (req, res, next) => {
  const { palabra } = req.params;
  const imgs = await scrapper("https://www.chollometro.com/", palabra);
  return res.status(200).json(imgs);
};

module.exports = { funcionPalabra }

 