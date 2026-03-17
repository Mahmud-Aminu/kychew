import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";
import { ROUTE_PATHS } from "@/routes/routePaths";
import kychewLogo from "@/assets/kychew-logo.png";
import { generateMembershipId, setUserDocument } from "@/services/authServices";
import { useAuth } from "@/hooks/useAuth";

type UserType = "" | "practitioner" | "student";
type InstitutionType = "" | "junior_chu" | "chu";

interface StepOneData {
  fullName: string;
  phone: string;
  lga: string;
  userType: UserType;
}

interface StepTwoData {
  licenseNumber: string;
  institutionType: InstitutionType;
  level: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  lga?: string;
  userType?: string;
  licenseNumber?: string;
  institutionType?: string;
  level?: string;
}

const STEPS = ["Basic Information", "Professional Verification"];

const LGA_OPTIONS = [
  { value: "batagarawa", label: "Batagarawa" },
  { value: "batsari", label: "Batsari" },
  { value: "baure", label: "Baure" },
  { value: "bindawa", label: "Bindawa" },
  { value: "charanchi", label: "Charanchi" },
  { value: "dandume", label: "Dandume" },
  { value: "danja", label: "Danja" },
  { value: "dan_musa", label: "Dan Musa" },
  { value: "daura", label: "Daura" },
  { value: "dutsi", label: "Dutsi" },
  { value: "dutsinma", label: "Dutsin-Ma" },
  { value: "faskari", label: "Faskari" },
  { value: "funtua", label: "Funtua" },
  { value: "ingawa", label: "Ingawa" },
  { value: "jibia", label: "Jibia" },
  { value: "kafur", label: "Kafur" },
  { value: "kaita", label: "Kaita" },
  { value: "kankara", label: "Kankara" },
  { value: "kankia", label: "Kankia" },
  { value: "katsina", label: "Katsina" },
  { value: "kurfi", label: "Kurfi" },
  { value: "kusada", label: "Kusada" },
  { value: "mai_adua", label: "Mai'Adua" },
  { value: "malumfashi", label: "Malumfashi" },
  { value: "mani", label: "Mani" },
  { value: "mashi", label: "Mashi" },
  { value: "matazu", label: "Matazu" },
  { value: "musawa", label: "Musawa" },
  { value: "rimi", label: "Rimi" },
  { value: "sabuwa", label: "Sabuwa" },
  { value: "safana", label: "Safana" },
  { value: "sandamu", label: "Sandamu" },
  { value: "zango", label: "Zango" },
];

const INSTITUTION_OPTIONS = [
  { value: "junior_chu", label: "JCHEW" },
  { value: "chu", label: "CHEW" },
  { value: "hnd", label: "ND/HND" },
];

const LEVEL_OPTIONS: Record<string, { value: string; label: string }[]> = {
  junior_chu: [
    { value: "level_1", label: "Level 1" },
    { value: "level_2", label: "Level 2" },
  ],
  chu: [
    { value: "level_1", label: "Level 1" },
    { value: "level_2", label: "Level 2" },
    { value: "level_3", label: "Level 3" },
  ],
  hnd: [
    { value: "level_1", label: "Level 1" },
    { value: "level_2", label: "Level 2" },
    { value: "level_3", label: "Level 3" },
  ],
};

function validateStepOne(data: StepOneData): FormErrors {
  const errors: FormErrors = {};
  if (!data.fullName.trim()) errors.fullName = "Full name is required";
  if (!data.phone.trim()) errors.phone = "Phone number is required";
  else if (!/^(\+234|0)\d{10}$/.test(data.phone.replace(/\s/g, "")))
    errors.phone = "Enter a valid Nigerian phone number";
  if (!data.lga) errors.lga = "Please select your LGA";
  if (!data.userType) errors.userType = "Please select your user type";
  return errors;
}

function validateStepTwo(data: StepTwoData, userType: UserType): FormErrors {
  const errors: FormErrors = {};
  if (userType === "practitioner") {
    if (!data.licenseNumber.trim())
      errors.licenseNumber = "License number is required";
  }
  if (userType === "student") {
    if (!data.institutionType)
      errors.institutionType = "Please select institution type";
    if (!data.level) errors.level = "Please select your level";
  }
  return errors;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { currentUser, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  const [stepOne, setStepOne] = useState<StepOneData>({
    fullName: "",
    phone: "",
    lga: "",
    userType: "",
  });

  const [stepTwo, setStepTwo] = useState<StepTwoData>({
    licenseNumber: "",
    institutionType: "",
    level: "",
  });

  const handleStepOneChange = (field: keyof StepOneData, value: string) => {
    setStepOne((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStepTwoChange = (field: keyof StepTwoData, value: string) => {
    setStepTwo((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "institutionType") {
        updated.level = "";
      }
      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNext = () => {
    const formErrors = validateStepOne(stepOne);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setCurrentStep(1);
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep(0);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formErrors = validateStepTwo(stepTwo, stepOne.userType);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    if (!currentUser) {
      return;
    }
    setLoading(true);
    const membershipId = await generateMembershipId();

    const data = {
      membershipId,
      fullName: stepOne.fullName,
      phone: stepOne.phone,
      lga: stepOne.lga,
      userType: stepOne.userType,
      ...stepTwo,
    };
    await setUserDocument(currentUser.uid, data);
    // Re-fetch the Firestore profile into the global context immediately.
    // onAuthStateChanged won't re-fire for the same session, so we do it manually.
    await refreshUserProfile();
    setLoading(false);
    navigate(ROUTE_PATHS.DASHBOARD);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-primary-50/60 via-surface-50 to-surface-50">
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-30 w-30 items-center justify-center rounded-full shadow-lg shadow-primary-500/20">
            <img
              src={kychewLogo}
              alt="KYChew logo"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-surface-900">
            Profile Setup
          </h1>
          <p className="mt-2 text-surface-500">
            Complete your profile to unlock all features
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-sm">
            <span
              className={`font-medium ${currentStep >= 0 ? "text-primary-700" : "text-surface-400"}`}
            >
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-surface-400">{STEPS[currentStep]}</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form card */}
        <div className="mt-8 rounded-2xl border border-surface-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} noValidate>
            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-surface-900">
                    Basic Information
                  </h2>
                  <p className="mt-1 text-sm text-surface-500">
                    Tell us a bit about yourself to personalize your experience.
                  </p>
                </div>

                <Input
                  label="Full Name"
                  placeholder="e.g. Aisha Bello"
                  value={stepOne.fullName}
                  onChange={(e) =>
                    handleStepOneChange("fullName", e.target.value)
                  }
                  error={errors.fullName}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+234 801 234 5678"
                  value={stepOne.phone}
                  onChange={(e) => handleStepOneChange("phone", e.target.value)}
                  error={errors.phone}
                  required
                />

                <Select
                  label="LGA (Local Government Area)"
                  options={LGA_OPTIONS}
                  value={stepOne.lga}
                  onChange={(e) => handleStepOneChange("lga", e.target.value)}
                  error={errors.lga}
                  required
                />

                {/* User Type selection */}
                <fieldset>
                  <legend className="text-sm font-medium text-surface-700">
                    I am a… <span className="text-red-500">*</span>
                  </legend>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {[
                      {
                        value: "practitioner",
                        label: "Practitioner",
                        icon: "🏥",
                        desc: "Licensed health worker",
                      },
                      {
                        value: "student",
                        label: "Student",
                        icon: "🎓",
                        desc: "Currently in training",
                      },
                    ].map((option) => {
                      const isSelected = stepOne.userType === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`
                            relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-5
                            text-center transition-all duration-200
                            ${
                              isSelected
                                ? "border-primary-500 bg-primary-50 shadow-sm shadow-primary-100"
                                : "border-surface-200 bg-white hover:border-surface-300 hover:shadow-sm"
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="userType"
                            value={option.value}
                            checked={isSelected}
                            onChange={(e) =>
                              handleStepOneChange("userType", e.target.value)
                            }
                            className="sr-only"
                          />
                          {isSelected && (
                            <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500">
                              <svg
                                className="h-3 w-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L7 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                          <span className="text-3xl" aria-hidden="true">
                            {option.icon}
                          </span>
                          <span className="text-sm font-semibold text-surface-900">
                            {option.label}
                          </span>
                          <span className="text-xs text-surface-500">
                            {option.desc}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.userType && (
                    <p className="mt-2 text-xs text-red-600" role="alert">
                      {errors.userType}
                    </p>
                  )}
                </fieldset>

                <Button type="button" onClick={handleNext} fullWidth size="lg">
                  Continue
                </Button>
              </div>
            )}

            {/* Step 2: Professional Verification */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-surface-900">
                    Professional Verification
                  </h2>
                  <p className="mt-1 text-sm text-surface-500">
                    Tailoring your experience based on your status.
                  </p>
                </div>

                {/* Practitioner fields */}
                {stepOne.userType === "practitioner" && (
                  <>
                    <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-primary-50 to-white border border-primary-100 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100">
                        <span className="text-xl" aria-hidden="true">
                          🏥
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-800">
                          Practitioner Verification
                        </p>
                        <p className="text-xs text-primary-600">
                          Enter your professional license to verify your
                          credentials.
                        </p>
                      </div>
                    </div>
                    <Input
                      label="License Number"
                      placeholder="Enter your professional ID"
                      value={stepTwo.licenseNumber}
                      onChange={(e) =>
                        handleStepTwoChange("licenseNumber", e.target.value)
                      }
                      error={errors.licenseNumber}
                      required
                    />
                  </>
                )}

                {/* Student fields */}
                {stepOne.userType === "student" && (
                  <>
                    <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-accent-50 to-white border border-accent-100 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-100">
                        <span className="text-xl" aria-hidden="true">
                          🎓
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-accent-800">
                          Student Verification
                        </p>
                        <p className="text-xs text-accent-600">
                          Tell us about your institution and current level.
                        </p>
                      </div>
                    </div>

                    <Select
                      label="Institutional Type"
                      options={INSTITUTION_OPTIONS}
                      value={stepTwo.institutionType}
                      onChange={(e) =>
                        handleStepTwoChange("institutionType", e.target.value)
                      }
                      error={errors.institutionType}
                      placeholder="Select institution type"
                      required
                    />

                    {stepTwo.institutionType && (
                      <Select
                        label="Level"
                        options={LEVEL_OPTIONS[stepTwo.institutionType] ?? []}
                        value={stepTwo.level}
                        onChange={(e) =>
                          handleStepTwoChange("level", e.target.value)
                        }
                        error={errors.level}
                        placeholder="Select your level"
                        required
                      />
                    )}
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    fullWidth
                    size="lg"
                  >
                    ← Back
                  </Button>
                  <Button type="submit" loading={loading} fullWidth size="lg">
                    Complete Setup
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Skip link */}
        <p className="mt-6 text-center text-sm text-surface-400">
          You can always update this later in your{" "}
          <span className="font-medium text-surface-500">Profile Settings</span>
        </p>
      </div>
    </div>
  );
}
