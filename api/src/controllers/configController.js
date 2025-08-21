import Config from "../models/Config.js";

// Create or update config
export const upsertConfig = async (req, res) => {
  try {
    const data = req.body;
    let config = await Config.findOne();
    if (config) {
      Object.assign(config, data);
    } else {
      config = new Config(data);
    }
    await config.save();
    res.status(200).json(config);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get config
export const getConfig = async (req, res) => {
  try {
    const config = await Config.findOne();
    if (!config) return res.status(404).json({ error: "Config not found" });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
