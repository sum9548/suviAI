import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-geminiApiKey");

    if (!user) {
      return res.status(400).json({ message: "Failed to get current user.." });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `getCurrent User error ${error}` });
  }
};

export const saveAssistant = async (req, res) => {
  try {
    const {
      assistantName,
      businessName,
      businessType,
      businessDescription,
      tone,
      theme,
      geminiApiKey,
      pages,
    } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.assistantName = assistantName;
    user.businessName = businessName;
    user.businessType = businessType;
    user.businessDescription = businessDescription;
    user.tone = tone;
    user.theme = theme;

    if (geminiApiKey) {
      user.geminiApiKey = geminiApiKey;
    }

    user.geminiStatus = "active";
    user.pages = (pages || []).map((page) => ({
      name: page.name,
      path: page.path,
      keywords: page.keywords || [],
    }));

    user.isSetupComplete = true;

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.geminiApiKey;

    return res.status(200).json({
      message: "Assistant saved successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Save assistant error:", error);

    return res.status(500).json({
      message: "Failed to save assistant",
    });
  }
};
