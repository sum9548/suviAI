// import User from "../models/user.model.js";

// export const googleAuth = async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     if (!name || !email) {
//       return res
//         .status(400)
//         .json({ message: "name and email are required..." });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({
//         name,
//         email,
//       });
//     }
//     const token = await genToken(user._id);
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json(user);
//   } catch (error) {
//     return res.status(500).json({ message: `Google auth error ${error}` });
//   }
// };

// export const logOut = async (req, res) => {
//   try {
//     await res.ClearCookie("token", {
//       httpOnly: true,
//       secure: false,
//       sameSite: "strict"
//     })
//      return res
//         .status(400)
//         .json({ message: "Logout successfully " });
//   } catch (error) {
//      return res
//         .status(500)
//         .json({ message: `Googlr auth error..${error}` });
//   }
// };

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
      httpOnly: true,
      secure: false,
      sameSite: "strict",
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
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Logout error.. ${error.message}` });
  }
};
