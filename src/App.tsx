import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/themeContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClinicRegistration from "./pages/ClinicRegistration";
import AdminDashboard from "./pages/AdminDashboard";
import StaffManagement from "./pages/StaffManagement";
import ShiftManagement from "./pages/ShiftManagement";
import ReceptionDashboard from "./pages/ReceptionDashboard";
import PatientRegistration from "./pages/PatientRegistration";
import PatientQueue from "./pages/PatientQueue";
import AdmittedPatients from "./pages/AdmittedPatients";
import NurseDashboard from "./pages/NurseDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import TodaysPatients from "./pages/TodaysPatients";
import Consultation from "./pages/Consultation";
import Patients from "./pages/Patients";
import Prescriptions from "./pages/Prescriptions";
import Analytics from "./pages/Analytics";
import DoctorAIAssistant from "./pages/DoctorAIAssistant";
import PatientDashboard from "./pages/PatientDashboard";
import PatientPrescriptions from "./pages/PatientPrescriptions";
import Reminder from "./pages/Reminder";
import PatientHistory from "./pages/PatientHistory";
import PatientAIAssistant from "./pages/PatientAIAssistant";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-clinic" element={<ClinicRegistration />} />
            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/staff" element={<StaffManagement />} />
            <Route path="/admin/shifts" element={<ShiftManagement />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            {/* Reception */}
            <Route path="/reception/dashboard" element={<ReceptionDashboard />} />
            <Route path="/reception/register-patient" element={<PatientRegistration />} />
            <Route path="/reception/patient-queue" element={<PatientQueue />} />
            <Route path="/reception/admitted" element={<AdmittedPatients />} />
            <Route path="/reception/settings" element={<SettingsPage />} />
            {/* Staff / Nurse */}
            <Route path="/staff/dashboard" element={<NurseDashboard />} />
            <Route path="/staff/admitted" element={<AdmittedPatients />} />
            {/* Doctor */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<TodaysPatients />} />
            <Route path="/doctor/consultation" element={<Consultation />} />
            <Route path="/doctor/prescriptions" element={<Prescriptions />} />
            <Route path="/doctor/admitted" element={<AdmittedPatients />} />
            <Route path="/doctor/shifts" element={<ShiftManagement />} />
            <Route path="/doctor/consultation" element={<Consultation />} />
            <Route path="/doctor/prescriptions" element={<Prescriptions />} />
            <Route path="/doctor/analytics" element={<Analytics />} />
            <Route path="/doctor/ai-assistant" element={<DoctorAIAssistant />} />
            <Route path="/doctor/settings" element={<SettingsPage />} />
            {/* Patient */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
            <Route path="/patient/schedule" element={<Reminder />} />
            <Route path="/patient/reminders" element={<Reminder />} />
            <Route path="/patient/history" element={<PatientHistory />} />
            <Route path="/patient/ai-assistant" element={<PatientAIAssistant />} />
            <Route path="/patient/settings" element={<SettingsPage />} />
            {/* AI Assistant (shared) */}
            <Route path="/ai-assistant" element={<DoctorAIAssistant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
