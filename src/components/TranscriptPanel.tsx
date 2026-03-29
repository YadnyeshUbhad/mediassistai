import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Pill, Clock, Calendar, Hash, Sparkles, Save, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { speechApi, agentApi, prescriptionApi } from "@/lib/api";
import { toast } from "sonner";

interface ExtractedEntity {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface AgentResult {
  entities: ExtractedEntity[];
  validation: { isValid: boolean; warnings: string[] };
  instructions: string;
}

interface TranscriptPanelProps {
  patientId?: string;
  patientName?: string;
}

export function TranscriptPanel({ patientId, patientName }: TranscriptPanelProps) {
  const [isRecording, setIsRecording]     = useState(false);
  const [processing, setProcessing]       = useState(false);
  const [saving, setSaving]               = useState(false);
  const [transcript, setTranscript]       = useState("");
  const [agentResult, setAgentResult]     = useState<AgentResult | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // ── Start microphone recording ─────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "consultation.webm", { type: "audio/webm" });
        await runPipeline(file);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch {
      // Microphone not available — run demo pipeline
      toast.info("Microphone unavailable — running demo consultation");
      await runPipeline(undefined);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    } else {
      // demo mode was already kicked off
    }
    setIsRecording(false);
  };

  const handleMicButton = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // ── Full pipeline: Speech → Agent ──────────────────────────────────────────
  const runPipeline = async (audioFile?: File) => {
    setProcessing(true);
    setAgentResult(null);
    try {
      // Step 1: Transcribe
      const sttRes = await speechApi.transcribe(audioFile) as any;
      const text: string = sttRes.data?.transcript || "";
      setTranscript(text);
      toast.success("✅ Speech transcribed");

      // Step 2: AI Agent
      const agentRes = await agentApi.process(text) as any;
      setAgentResult(agentRes.data);
      toast.success("🧠 AI analysis complete");
    } catch (err: any) {
      toast.error(`Processing failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  // ── Save prescription ──────────────────────────────────────────────────────
  const savePrescription = async () => {
    if (!agentResult || !patientId) {
      toast.error("Please select a patient first");
      return;
    }
    setSaving(true);
    try {
      const medicines = agentResult.entities.map((e) => ({
        name: e.medicine, dosage: e.dosage,
        frequency: e.frequency, duration: e.duration, notes: "",
      }));

      await prescriptionApi.create({
        patientId,
        medicines,
        diagnosis: "",
        instructions: "",
        aiInstructions: agentResult.instructions,
        transcript,
        entities: agentResult.entities,
        validationWarnings: agentResult.validation.warnings,
        autoCreateReminders: true,
      }) as any;

      toast.success("💊 Prescription saved & reminders created!");
    } catch (err: any) {
      toast.error(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const isConnected = Boolean(localStorage.getItem("medassist_token"));

  return (
    <div className="space-y-6">
      {/* Recording Control */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={handleMicButton}
          disabled={processing}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            isRecording
              ? "bg-destructive text-destructive-foreground"
              : "bg-primary text-primary-foreground hover:opacity-90"
          } disabled:opacity-50`}
        >
          {processing ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
          ) : isRecording ? (
            <><MicOff className="h-5 w-5" /> Stop Recording</>
          ) : (
            <><Mic className="h-5 w-5" /> Start Consultation</>
          )}
        </button>

        {!isConnected && (
          <span className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg">
            ⚠️ Backend offline — using demo mode
          </span>
        )}

        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="flex h-3 w-3 rounded-full bg-destructive" />
              <span className="absolute inset-0 h-3 w-3 rounded-full bg-destructive animate-pulse-ring" />
            </div>
            <span className="text-sm text-muted-foreground">Listening...</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {(transcript || agentResult) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Live Transcript */}
            {transcript && (
              <div className="stat-card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Mic className="h-4 w-4 text-primary" />
                  Live Transcript
                </h3>
                <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-line">
                  {transcript}
                </div>
              </div>
            )}

            {agentResult && (
              <>
                {/* Validation Warnings */}
                {agentResult.validation.warnings.length > 0 && (
                  <div className="stat-card border-amber-500/30 bg-amber-50/30 dark:bg-amber-900/10">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4" />
                      Validation Warnings ({agentResult.validation.warnings.length})
                    </h3>
                    <ul className="space-y-1.5">
                      {agentResult.validation.warnings.map((w, i) => (
                        <li key={i} className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Extracted Entities */}
                {agentResult.entities.length > 0 && (
                  <div className="stat-card">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-secondary" />
                      Extracted Entities
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${agentResult.validation.isValid ? "bg-success/10 text-success" : "bg-amber-500/10 text-amber-600"}`}>
                        {agentResult.validation.isValid ? "✓ Valid" : "⚠ Review needed"}
                      </span>
                    </h3>
                    <div className="space-y-3">
                      {agentResult.entities.map((entity, idx) => (
                        <div key={idx} className="bg-muted/50 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground mb-2 font-medium">Medicine {idx + 1}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                              { icon: Pill,     label: "Medicine",  value: entity.medicine  },
                              { icon: Hash,     label: "Dosage",    value: entity.dosage    },
                              { icon: Clock,    label: "Frequency", value: entity.frequency },
                              { icon: Calendar, label: "Duration",  value: entity.duration  },
                            ].map(({ icon: Icon, label, value }) => (
                              <div key={label} className="bg-background/80 rounded-lg p-2.5">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Icon className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{label}</span>
                                </div>
                                <p className="text-sm font-semibold">{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Instructions */}
                <div className="stat-card border-secondary/30 bg-accent/30">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-secondary" />
                    AI-Generated Patient Instructions
                  </h3>
                  <p className="text-sm leading-relaxed">{agentResult.instructions}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={savePrescription}
                    disabled={saving || !patientId}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Saving..." : "Save Prescription"}
                  </button>
                  <button
                    onClick={() => { setTranscript(""); setAgentResult(null); }}
                    className="px-6 py-2.5 rounded-xl border border-border font-medium text-sm hover:bg-muted transition-colors"
                  >
                    Clear & Restart
                  </button>
                  {!patientId && (
                    <p className="text-xs text-amber-600 self-center">← Select a patient to save</p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
