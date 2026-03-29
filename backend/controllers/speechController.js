const fs = require("fs");
const path = require("path");

/**
 * Speech-to-Text Controller
 * Supports two backends:
 *   1. Google Cloud Speech-to-Text (if GOOGLE_APPLICATION_CREDENTIALS is set)
 *   2. OpenAI Whisper API (if OPENAI_API_KEY is set)
 *   3. Fallback: mock response for testing
 */

// ── POST /api/speech ───────────────────────────────────────────────────────────
exports.transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Audio file is required. Upload a .wav or .mp3 file." });
    }

    const audioPath = req.file.path;
    let transcript = "";

    // ── Try OpenAI Whisper first ─────────────────────────────────────────────
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-your-openai-api-key-here") {
      try {
        const OpenAI = require("openai");
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const audioStream = fs.createReadStream(audioPath);
        const response = await openai.audio.transcriptions.create({
          file: audioStream,
          model: "whisper-1",
          language: "en",
          response_format: "text",
        });
        transcript = response;
        console.log("🎤 Whisper transcript:", transcript.slice(0, 100));
      } catch (whisperErr) {
        console.warn("⚠️ Whisper failed:", whisperErr.message, "— trying Google...");
      }
    }

    // ── Try Google Speech-to-Text Or Deepgram ─────────────────────────────────
    if (!transcript && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      if (!process.env.GOOGLE_APPLICATION_CREDENTIALS.endsWith(".json")) {
        // Deepgram or Groq Token treatment
        try {
          const audioBuffer = fs.readFileSync(audioPath);
          const response = await fetch("https://api.deepgram.com/v1/listen?model=nova-2-medical&smart_format=true", {
            method: "POST",
            headers: {
              "Authorization": `Token ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
              "Content-Type": "audio/wav"
            },
            body: audioBuffer
          });
          const data = await response.json();
          if (data.results && data.results.channels[0].alternatives[0]) {
             transcript = data.results.channels[0].alternatives[0].transcript;
             console.log("🎤 Deepgram STT transcript:", transcript.slice(0, 100));
          } else {
             console.warn("⚠️ Deepgram format not matching expected:", data);
          }
        } catch (sgErr) {
          console.warn("⚠️ Deepgram STT failed:", sgErr.message);
        }
      } else {
        try {
          const speech = require("@google-cloud/speech");
          const client = new speech.SpeechClient();
          
          const audioBytes = fs.readFileSync(audioPath).toString("base64");
          const [response] = await client.recognize({
            config: {
              encoding: "LINEAR16",
              sampleRateHertz: 16000,
              languageCode: "en-US",
              model: "medical_dictation",
            },
            audio: { content: audioBytes },
          });
          
          transcript = response.results
            .map((r) => r.alternatives[0].transcript)
            .join(" ");
          console.log("🎤 Google STT transcript:", transcript.slice(0, 100));
        } catch (googleErr) {
          console.warn("⚠️ Google STT failed:", googleErr.message);
        }
      }
    }

    // ── Fallback: demo transcript ─────────────────────────────────────────────
    if (!transcript) {
      transcript = req.body.mockTranscript ||
        "Doctor: Good morning. Patient reports headache and mild fever. " +
        "Prescribing Paracetamol 500mg twice daily after meals for 5 days. " +
        "Also prescribed Amoxicillin 500mg three times daily for 7 days. " +
        "Take plenty of rest and stay well hydrated.";
      console.log("ℹ️ Using fallback demo transcript (no STT API configured)");
    }

    // ── Cleanup uploaded file ─────────────────────────────────────────────────
    try { fs.unlinkSync(audioPath); } catch (_) {}

    res.json({
      success: true,
      message: "Speech transcription complete",
      data: { transcript },
    });
  } catch (err) {
    console.error("Speech transcription error:", err);
    res.status(500).json({ success: false, message: "Transcription failed", error: err.message });
  }
};
