(function () {
  // userData
  const script = document.currentScript;
  const userId = script?.dataset?.userId;

  const theme = "neon";
  let assistantConfig = null;

  // load CSS

  const link = document.createElement("link");

  link.rel = "stylesheet";

  link.href = "http://localhost:5173/assistant.css";

  document.head.appendChild(link);

  // Create POP-UP
  const popUp = document.createElement("div");

  popUp.className = `suvi-popup theme-${theme}`;

  popUp.innerHTML = `

<div class="suvi-overlay"> </div>

    <div class="suvi-content">
   
            <div class="suvi-top">

            <div class="suvi-orb-wrap">
                <div class="suvi-orb-glow"></div>
                <div class="suvi-orb"></div>
            </div>

            <h2 class="suvi-title">
                Hello I'm Suvi AI
            </h2>

                <p class="suvi-sub">
                    Your smart voice assistant.
                    <br />
                    Ask anything about your website.
                </p>

            <div class="suvi-status">
                Tap button to Speak
            </div>

            <div class="suvi-wave">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

         <!-- User Text -->

        <div class="suvi-user-text">
            
        </div>

          <!-- AI text -->

        <div class="suvi-ai-text">
        </div>

        </div>

        <div class="suvi-bottom">
            <button class="suvi-mic">
                <img src="http://localhost:5173/mic.svg" alt="mic" width="100px" height="100px" class="suvi-mic-icon" />
            </button>
        </div>

</div>

`;

  document.body.appendChild(popUp);
  popUp.style.display = "none";

  // flaoting button

  const button = document.createElement("button");

  button.className = `suvi-btn theme-${theme}`;
  button.innerHTML = `
    <img src="http://localhost:5173/suvi1.png"
    alt="suvi AI" class="suvi-btn-icon" />
`;

  document.body.appendChild(button);

  // toggle popup
  // Toggle popup and greet the user

  let open = false;

  button.onclick = () => {
    open = !open;

    popUp.style.display = open ? "flex" : "none";

    // Greet the user when the popup opens
    if (open) {
      greetUser();
    }
  };

  // load Assistant

  const loadAssistant = async () => {
    try {
      if (!userId) {
        console.error("Missing data-user-id on the script tag");
        return;
      }

      const res = await fetch(
        `http://localhost:8000/api/assistant/config/${userId}`,
      );

      const data = await res.json();

      console.log("Status:", res.status);
      // console.log("Backend response:", data);

      if (!res.ok) {
        console.error("Failed to load assistant:", data.message);
        return;
      }

      assistantConfig = data.user;
      applyConfig();
    } catch (error) {
      console.error("Assistant load error:", error);
    }
  };

  const applyConfig = () => {
    if (!assistantConfig) return;

    // Apply the selected theme
    const theme = assistantConfig.theme || "dark";

    popUp.className = `suvi-popup theme-${theme}`;
    button.className = `suvi-btn theme-${theme}`;

    // Find the title and subtitle
    const title = popUp.querySelector(".suvi-title");
    const subTitle = popUp.querySelector(".suvi-sub");

    // Get the saved assistant and business names
    const assistantName = assistantConfig.assistantName?.trim() || "Suvi AI";

    const businessName = assistantConfig.businessName?.trim();

    // Display the assistant name
    title.textContent = `Hello! I'm ${assistantName} AI`;

    // Display the business name
    subTitle.textContent = businessName
      ? `Welcome to ${businessName}. Ask anything about this website.`
      : "Your smart voice assistant. Ask anything about this website.";
  };

  // Element

  const status = popUp.querySelector(".suvi-status");

  const wave = popUp.querySelector(".suvi-wave");

  const userText = popUp.querySelector(".suvi-user-text");

  const aiText = popUp.querySelector(".suvi-ai-text");

  const mic = popUp.querySelector(".suvi-mic");

  //  text-speech

  // Text to Speech
  const speak = (text) => {
    window.speechSynthesis.cancel();

    aiText.textContent = text;
    status.innerText = "AI Speaking...";

    const speech = new SpeechSynthesisUtterance(text);

    // Detect Hindi script; otherwise use English voice.
    const isHindi = /[\u0900-\u097F]/.test(text);

    speech.lang = isHindi ? "hi-IN" : "en-IN";

    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onend = () => {
      status.innerText = "Tap button to Speak";
      wave.style.opacity = "0";
    };

    window.speechSynthesis.speak(speech);
  };

  // Assistant greeting
  let hasGreeted = false;

  const greetUser = () => {
    if (!assistantConfig || hasGreeted) return;

    const assistantName = assistantConfig.assistantName?.trim() || "Suvi";

    const businessName = assistantConfig.businessName?.trim();

    const greeting = businessName
      ? `Hello! I'm ${assistantName}. Welcome to ${businessName}. How can I help you today?`
      : `Hello! I'm ${assistantName}. How can I help you today?`;

    hasGreeted = true;

    speak(greeting);
  };

  // toggle popup

  // const SpeechRecognition =
  //   window.SpeechRecognition || window.webkitSpeechRecognition;

  // if (SpeechRecognition) {
  //   const englishRecognition = new SpeechRecognition();
  //   const hindiRecognition = new SpeechRecognition();

  //   englishRecognition.lang = "en-IN";
  //   hindiRecognition.lang = "hi-IN";

  //   englishRecognition.continuous = false;
  //   hindiRecognition.continuous = false;

  //   englishRecognition.interimResults = false;
  //   hindiRecognition.interimResults = false;

  //   let recognitionResults = [];
  //   let activeRecognitions = 0;
  //   let hasSentMessage = false;

  //   const finishRecognition = () => {
  //     activeRecognitions--;

  //     if (activeRecognitions === 0 && !hasSentMessage) {
  //       hasSentMessage = true;

  //       if (recognitionResults.length === 0) {
  //         status.innerText = "Could not understand. Try again.";
  //         wave.style.opacity = "0";
  //         return;
  //       }

  //       // Prefer the result containing more recognized words.
  //       recognitionResults.sort(
  //         (a, b) => b.split(/\s+/).length - a.split(/\s+/).length,
  //       );

  //       const text = recognitionResults[0];

  //       console.log("Recognized text:", text);

  //       userText.textContent = "You: " + text;

  //       sendMessage(text);
  //     }
  //   };

  //   [englishRecognition, hindiRecognition].forEach((recognition) => {
  //     recognition.onresult = (event) => {
  //       const text =
  //         event.results[event.results.length - 1][0].transcript.trim();

  //       if (text) {
  //         recognitionResults.push(text);
  //       }
  //     };

  //     recognition.onerror = (event) => {
  //       console.log("Recognition error:", event.error);
  //     };

  //     recognition.onend = finishRecognition;
  //   });

  //   mic.onclick = () => {
  //     recognitionResults = [];
  //     activeRecognitions = 2;
  //     hasSentMessage = false;

  //     wave.style.opacity = "1";
  //     status.innerText = "Listening...";
  //     userText.innerText = "";
  //     aiText.innerText = "";

  //     try {
  //       englishRecognition.start();
  //       hindiRecognition.start();
  //     } catch (error) {
  //       console.log("Recognition start error:", error);
  //       status.innerText = "Could not start microphone.";
  //       wave.style.opacity = "0";
  //     }
  //   };
  // } else {
  //   status.innerText = "Speech Recognition not supported";
  // }

  // ===== NEW CODE START: Gemini audio recording =====

  let mediaRecorder;
  let audioStream;
  let audioContext;
  let silenceCheckId;
  let audioChunks = [];
  let isRecording = false;

  let speechStartedAt = 0;
  let lastSoundAt = 0;
  let recordingStartedAt = 0;

  const stopRecording = () => {
    if (!isRecording) return;

    isRecording = false;

    cancelAnimationFrame(silenceCheckId);

    status.innerText = "Processing voice...";

    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        status.innerText = "Audio recording is not supported.";
        return;
      }

      audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/ogg;codecs=opus",
        "audio/mp4",
      ];

      const selectedMimeType = mimeTypes.find((type) =>
        MediaRecorder.isTypeSupported(type),
      );

      mediaRecorder = selectedMimeType
        ? new MediaRecorder(audioStream, { mimeType: selectedMimeType })
        : new MediaRecorder(audioStream);

      audioChunks = [];
      speechStartedAt = 0;
      lastSoundAt = 0;
      recordingStartedAt = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        audioStream.getTracks().forEach((track) => track.stop());

        if (audioContext && audioContext.state !== "closed") {
          audioContext.close();
        }

        wave.style.opacity = "0";

        if (blob.size === 0) {
          status.innerText = "No voice detected. Try again.";
          return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
          const base64 = String(reader.result).split(",")[1];

          sendMessage("", base64, blob.type.split(";")[0] || "audio/webm");
        };

        reader.readAsDataURL(blob);
      };

      mediaRecorder.start(250);

      isRecording = true;
      wave.style.opacity = "1";
      status.innerText = "Listening...";
      userText.innerText = "";
      aiText.innerText = "";

      audioContext = new AudioContext();

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      const source = audioContext.createMediaStreamSource(audioStream);
      source.connect(analyser);

      const audioData = new Uint8Array(analyser.fftSize);

      const checkSilence = () => {
        if (!isRecording) return;

        analyser.getByteTimeDomainData(audioData);

        let sum = 0;

        for (let i = 0; i < audioData.length; i++) {
          const value = (audioData[i] - 128) / 128;
          sum += value * value;
        }

        const volume = Math.sqrt(sum / audioData.length);
        const now = Date.now();

        if (volume > 0.025) {
          if (!speechStartedAt) {
            speechStartedAt = now;
          }

          lastSoundAt = now;
        }

        // Stop after 1.4 seconds of silence.
        if (speechStartedAt && now - lastSoundAt > 1400) {
          stopRecording();
          return;
        }

        // Maximum recording time: 15 seconds.
        if (now - recordingStartedAt > 15000) {
          stopRecording();
          return;
        }

        silenceCheckId = requestAnimationFrame(checkSilence);
      };

      checkSilence();
    } catch (error) {
      console.error("Microphone error:", error);

      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }

      status.innerText = "Could not access microphone.";
      wave.style.opacity = "0";
      isRecording = false;
    }
  };

  mic.onclick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // ===== NEW CODE END =====

  // Send message to backend
  // const sendMessage = async (text) => {
  //   try {
  //     status.innerText = "Thinking...";

  //     const res = await fetch("http://localhost:8000/api/assistant/ask", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         message: text,
  //         userId,
  //       }),
  //     });

  //     const data = await res.json();
  //     console.log("Assistant response:", data);

  //     if (data.success) {
  //       speak(data.aiResponse || data.response);
  //     } else {
  //       speak(data.message || "Sorry, something went wrong.");
  //     }
  //   } catch (error) {
  //     console.log("Assistant server error:", error);
  //     speak("AI server error");
  //   }
  // };

  // ===== CHANGED CODE START: Send message to backend =====

  const sendMessage = async (text, audioBase64 = null, mimeType = null) => {
    try {
      status.innerText = "Thinking...";

      const res = await fetch("http://localhost:8000/api/assistant/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text || "",
          audioBase64,
          mimeType,
          userId,
          currentPath: window.location.pathname,
        }),
      });

      const data = await res.json();

      console.log("Assistant response:", data);

      if (data.success) {
        if (data.transcript) {
          userText.textContent = "You: " + data.transcript;
        }

        // ===== NAVIGATION CODE START =====
        if (data.action === "navigate" && data.path) {
          speak(data.response || "Opening page.");

          setTimeout(() => {
            window.location.href = data.path;
          }, 800);

          return;
        }
        // ===== NAVIGATION CODE END =====

        speak(data.aiResponse || data.response);
      } else {
        speak(data.message || "Sorry, something went wrong.");
      }
    } catch (error) {
      console.error("Assistant server error:", error);
      status.innerText = "AI server error.";
    }
  };

  // ===== CHANGED CODE END =====

  // Load assistant configuration
  loadAssistant();
})();
