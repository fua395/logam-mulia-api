import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const url = "https://www.logammulia.com/id/harga-emas-hari-ini";

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
      },
      timeout: 15000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // === PARSING HARGA (AMAN) ===
    const priceText = $("table tbody tr")
      .first()
      .find("td")
      .eq(1)
      .text()
      .replace(/\D/g, "");

    const buybackText = $("table tbody tr")
      .first()
      .find("td")
      .eq(2)
      .text()
      .replace(/\D/g, "");

    if (!priceText) {
      throw new Error("Parsing harga gagal");
    }

    const price = Number(priceText);
    const buyback = Number(buybackText);

    return res.status(200).json({
      status: "success",
      name: "Emas Antam",
      price,
      buyback,
      unit: "gram",
      source: "logammulia.com",
      date: new Date().toISOString().split("T")[0]
    });
  } catch (error) {
    console.error("ANTAM API ERROR:", error.message);

    return res.status(200).json({
      status: "error",
      message: "Gagal mengambil harga emas Antam",
      fallback: true,
      date: new Date().toISOString().split("T")[0]
    });
  }
}
