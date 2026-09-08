import { MetalRate } from '../models/index.js';
import { logAudit } from '../utils/auditLogger.js';

const getTodayDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + "-" + month + "-" + day;
};

export const fetchMetalRates = async (req, res) => {
  try {
    const metals = [
      { code: "XAU", name: "Gold" },
      { code: "XAG", name: "Silver" },
      { code: "XPT", name: "Platinum" },
      { code: "XPD", name: "Palladium" },
    ];

    const today = getTodayDateString();

    // 1st Check: Are today's rates already stored?
    const existingRates = await MetalRate.findAll({
      where: {
        rateDate: today,
        deleted: false,
      }
    });

    // If we have rates for all 4 metals, return immediately without calling the external API
    if (existingRates.length >= metals.length) {
      return res.status(200).json({
        status: "success",
        message: "Today's metal rates are already stored. No external API call needed.",
        count: existingRates.length,
        data: existingRates,
      });
    }

    const results = [];
    const apiKey = process.env.METAL_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ status: "error", message: "METAL_API_KEY is not set in environment variables." });
    }

    // Call external API for missing ones
    for (const metal of metals) {
      try {
        // Double-check if this specific metal is already saved to avoid redundant API call
        let record = await MetalRate.findOne({
          where: {
            metalCode: metal.code,
            rateDate: today,
            deleted: false,
          },
        });

        if (record) {
          results.push(record);
          continue;
        }

        const url = "https://api.metalpriceapi.com/v1/latest?api_key=" + apiKey + "&base=" + metal.code + "&currencies=INR";
        const response = await fetch(url);
        const data = await response.json();

        const ratePerOunceINR = Number(data?.rates?.INR);

        if (!ratePerOunceINR) continue;

        const ratePerGramINR = ratePerOunceINR / 31.1035;

        const payload = {
          metalCode: metal.code,
          metalName: metal.name,
          ratePerOunceINR: ratePerOunceINR.toFixed(2),
          ratePerGramINR: ratePerGramINR.toFixed(2),
          rateDate: today,
          source: "MetalPriceAPI",
        };

        // GOLD ONLY Math
        if (metal.code === "XAU") {
          payload.rate24K = ratePerGramINR.toFixed(2);
          payload.rate22K = (ratePerGramINR * 0.916).toFixed(2);
          payload.rate18K = (ratePerGramINR * 0.75).toFixed(2);
        }

        record = await MetalRate.create(payload);
        results.push(record);

        await logAudit({
          req,
          action: 'CREATE',
          module: 'GOLD_SILVER_RATE',
          description: "Fetched and stored latest " + metal.name + " rates from API",
          entity: { id: record.id, type: 'METAL_RATE', name: metal.name },
          changes: null
        });

      } catch (error) {
        console.log(metal.name + " Error", error.message);
      }
    }

    return res.status(200).json({
      status: "success",
      message: "Metal rates synced successfully",
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getLatestMetalRates = async (req, res) => {
  try {
    // Find latest date available
    const latestRecord = await MetalRate.findOne({
      where: { deleted: false },
      order: [["rateDate", "DESC"]],
    });

    if (!latestRecord) {
      return res.status(200).json({
        status: "success",
        data: [],
      });
    }

    // Get all metals for that date
    const metalRates = await MetalRate.findAll({
      where: {
        rateDate: latestRecord.rateDate,
        deleted: false,
      },
      order: [["metalName", "ASC"]],
    });

    return res.status(200).json({
      status: "success",
      rateDate: latestRecord.rateDate,
      count: metalRates.length,
      data: metalRates,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
