
import User from "../models/user.model.js";
import genToken from "../utils/genToken.js";

export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "name and email are required..." });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email });
    }

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = user.toObject();
    delete safeUser.geminiApiKey;

    return res.status(200).json(safeUser);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Google auth error ${error.message}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Logout error.. ${error.message}` });
  }
};
