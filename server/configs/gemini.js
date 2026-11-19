
const Gemini_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";

export const generateGeminiResponse = async (prompt, apiKey, user) => {
  try {
    if (!apiKey) {
      throw new Error("Gemini API key missing.");
    }

    // ===== CHANGED CODE START =====
    console.time("Gemini text generation");

    const response = await fetch(`${Gemini_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 256,
          temperature: 0.7,
        },
      }),
    });

    console.timeEnd("Gemini text generation");
    // ===== CHANGED CODE END =====

    if (!response.ok) {
      if (response.status === 400 || response.status === 401) {
        user.geminiStatus = "invalid";
        await user.save();
      }

      if (response.status === 429) {
        user.geminiStatus = "quota_exceeded";
        await user.save();
      }

      const err = await response.text();
      throw new Error(err);
    }

    const data = await response.json();

    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!text) {
      console.log("Gemini returned:", JSON.stringify(data, null, 2));
      throw new Error("No text returned from Gemini");
    }

    user.geminiStatus = "active";
    await user.save();

    return text;
  } catch (error) {
    console.error("Gemini response error:", error.message);
    throw error;
  }
};
