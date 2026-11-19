import { generateGeminiResponse } from "../configs/gemini.js";
import User from "../models/user.model.js";

export const getAssistantConfig = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Requested ID:", userId);

    const foundUser = await User.findById(userId).select("-geminiApiKey");

    if (!foundUser) {
      return res.status(404).json({
        message: "User not found for this ID",
      });
    }

    return res.status(200).json({
      message: "Assistant config data",
      user: foundUser,
    });
  } catch (error) {
    console.error("Assistant config error:", error);

    return res.status(500).json({
      message: "Assistant config failed",
      error: error.message,
    });
  }
};

export const askAssistant = async (req, res) => {
  try {
    // const { message, userId, currentPath } = req.body;
    // ===== CHANGED CODE START =====

    let { message, userId, currentPath, audioBase64, mimeType } = req.body;

    message = message || "";

    // ===== CHANGED CODE START =====
    if ((!message.trim() && !audioBase64) || !userId) {
      return res.status(400).json({
        message: "Message, audio or UserId is required.",
      });
    }
    // ===== CHANGED CODE END =====

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User is not found.",
      });
    }

    if (!user.geminiApiKey) {
      return res.status(400).json({
        message: "Gemini API key is not added.",
      });
    }

    // Check free plan limit
    // ===== NEW CODE START =====

    // Convert microphone audio into text using Gemini.
    if (audioBase64) {
      message = await transcribeGeminiAudio(
        audioBase64,
        mimeType,
        user.geminiApiKey,
      );

      console.log("Recognized audio text:", message);
    }

    if (!message?.trim()) {
      return res.status(400).json({
        message: "Could not recognize your voice. Try again.",
      });
    }

    // ===== NEW CODE END =====
    if (user.plan === "free" && user.totalMessages >= user.requestLimit) {
      return res.status(403).json({
        message: "Free limit reached.",
      });
    }

    // Check Pro plan expiry
    if (
      user.plan === "pro" &&
      user.proExpiresAt &&
      new Date(user.proExpiresAt) < new Date()
    ) {
      user.plan = "free";
      await user.save();

      return res.status(403).json({
        message: "Pro plan expired.",
      });
    }

    // ===== CHANGED CODE START =====

    // Clean the user's voice command
    const cleanMessage = message
      .toLowerCase()
      .trim()
      .replace(/[.,!?]/g, " ")
      .replace(/^(hey\s+)?suvi(\s+ai)?\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();

    // Detect navigation commands in English and Hindi
    if (user.enableNavigation) {
      const navigationWords = [
        "open",
        "go to",
        "go",
        "take me",
        "navigate",
        "show me",
        "start",
        "खोलो",
        "खोल",
        "जाओ",
        "ले चलो",
        "दिखाओ",
      ];

      const wantsNavigation = navigationWords.some((word) =>
        cleanMessage.includes(word),
      );

      if (wantsNavigation) {
        const matchedPage = user.pages.find((page) => {
          const pageKeywords = [page.name, ...(page.keywords || [])].filter(
            Boolean,
          );

          return pageKeywords.some((keyword) =>
            cleanMessage.includes(keyword.toLowerCase().trim()),
          );
        });

        if (matchedPage) {
          if (currentPath === matchedPage.path) {
            return res.json({
              success: true,
              response: `${matchedPage.name} is already open.`,
            });
          }

          return res.json({
            success: true,
            action: "navigate",
            path: matchedPage.path,
            response: `Opening ${matchedPage.name}.`,
          });
        }
      }
    }

    // ===== CHANGED CODE END =====

    // Gemini prompt
    const prompt = `
  You are ${user.assistantName || "Suvi AI"}.

  Business Name: ${user.businessName || "Not provided"}
  Business Type: ${user.businessType || "Not provided"}
  Business Description: ${user.businessDescription || "Not provided"}
  Assistant Tone: ${user.tone || "friendly"}

// Language Rules:
// - Automatically detect the language of the user's message.
// - If the user speaks English, respond in English.
// - If the user speaks Hindi, respond in Hindi.
// - If the user speaks Hinglish, respond in natural Hinglish.
// - Always respond in the same language as the user.
// - Do not translate the user's message unless requested.

// ===== CHANGED CODE START =====

Language Rules:
- Automatically identify the language of the user's message.
- Hindi: Reply in Hindi using Devanagari script.
- English: Reply in English.
- Hinglish: Reply in natural Hinglish using English letters.
- If the user mixes Hindi and English, respond naturally in Hinglish.
- Never convert Romanized Hinglish into Devanagari.
- Always follow the language and writing style used by the user.

// ===== CHANGED CODE END =====

Response Rules:
- Keep replies under 10 words whenever possible.
- Answer directly without unnecessary introductions.
- Avoid unnecessary explanations.
- Give fast, direct responses.
- Talk naturally.
- Behave like a smart voice assistant.
- Keep responses short for quick voice playback.

User Question: ${message}
`;
    // Get Gemini response
    const aiResponse = await generateGeminiResponse(
      prompt,
      user.geminiApiKey,
      user,
    );

    // Update message count
    if (user.plan === "free") {
      user.totalMessages += 1;
      await user.save();
    }

    // return res.status(200).json({
    //   success: true,
    //   aiResponse: aiResponse,
    // });
    // ===== CHANGED CODE START =====

    return res.status(200).json({
      success: true,
      transcript: message,
      aiResponse: aiResponse,
    });

    // ===== CHANGED CODE END =====
  } catch (error) {
    console.error("Ask assistant error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing your message.",
    });
  }
};

// ===== NEW CODE START: Audio transcription =====

const transcribeGeminiAudio = async (audioBase64, mimeType, apiKey) => {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-transcribe:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: audioBase64,
                },
              },
              {
                text: "Transcribe exactly what the speaker says. Automatically detect the language. Preserve Hindi in Devanagari, English in English, and Hinglish in Roman letters. Do not translate.",
              },
            ],
          },
        ],
        generationConfig: {
          audioTranscriptionConfig: {
            languageCodes: [],
          },
        },
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const data = await response.json();

  // ===== CHANGED CODE START =====

  console.log("Gemini transcription response:", JSON.stringify(data, null, 2));

  const transcript = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || part.audioTranscription?.text || "")
    .join("")
    .trim();

  // ===== CHANGED CODE END =====

  if (!transcript) {
    throw new Error("Could not recognize your voice.");
  }

  return transcript;
};

// ===== NEW CODE END =====
