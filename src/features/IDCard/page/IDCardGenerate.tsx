import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import idConfig from "@/helpers/id.config.json";
import frontBg from "@/assets/front.png";
import backBg from "@/assets/back.png";
import QRCode from "react-qr-code";
import { useAuth } from "@/hooks/useAuth";
import { getIssueAndExpiryDate } from "@/helpers/helpers";
import { ROUTE_PATHS } from "@/routes/routePaths";
import SignaturePad from "@/features/IDCard/components/SignaturePad";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { uploadIDCardAssets } from "@/services/paymentService";

const STEPS = [
  "Verify",
  "Upload",
  "Signature",
  "Preview",
  "Payment",
  "Download",
];

export default function IDCardGenerate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [passportUrl, setPassportUrl] = useState<string>("");
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalPhase, setModalPhase] = useState<
    "generating" | "success" | "error"
  >("generating");

  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);
  const idCardRef = useRef<HTMLDivElement>(null);

  const { userProfile, currentUser, refreshUserProfile } = useAuth();
  const { issueDate, expiryDate } = getIssueAndExpiryDate();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleAssetsUpload = async () => {
    if (!currentUser?.uid || !passportFile || !signatureUrl) {
      alert(
        "Please ensure both your passport photo and signature are provided.",
      );
      return;
    }
    setShowModal(true);
    setModalPhase("generating");
    try {
      await uploadIDCardAssets(
        currentUser.uid,
        passportFile,
        signatureUrl,
        issueDate,
        expiryDate,
      );
      await refreshUserProfile();
      setModalPhase("success");
    } catch (err) {
      console.error("Failed to upload assets:", err);
      setModalPhase("error");
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setPassportFile(file);
      const url = URL.createObjectURL(file);
      setPassportUrl(url);
    }
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setPassportFile(file);
        const url = URL.createObjectURL(file);
        setPassportUrl(url);
      }
    },
    [],
  );

  // ref to forward clicks from custom button to hidden input
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fileInputRef = useCallback((_node: HTMLInputElement | null) => {
    // nothing needed here, but keeps the ref typed
  }, []);

  const triggerFileDialog = () => {
    const input = document.getElementById(
      "passport-upload-input",
    ) as HTMLInputElement | null;
    if (input) input.click();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-primary-50/60 via-surface-50 to-surface-50">
      <style>{`
                .card-flip-container {
                    perspective: 1000px;
                }
                .card-flip-inner {
                    position: relative;
                    transition: transform 0.6s ease-in-out;
                    transform-style: preserve-3d;
                }
                .card-flip-inner.flipped {
                    transform: rotateY(180deg);
                }
                .card-side {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .card-front {
                    transform: rotateY(0deg);
                }
                .card-back {
                    transform: rotateY(180deg);
                }
                @keyframes idcard-spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes idcard-fade-in {
                    from { opacity: 0; transform: scale(0.92); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes idcard-pulse {
                    0%, 100% { transform: scale(1); }
                    50%      { transform: scale(1.08); }
                }
                @keyframes idcard-check-draw {
                    to { stroke-dashoffset: 0; }
                }
                .idcard-modal-backdrop {
                    position: fixed; inset: 0; z-index: 50;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(0,0,0,0.45);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    animation: idcard-fade-in 0.25s ease-out;
                }
                .idcard-modal-card {
                    background: white;
                    border-radius: 1.25rem;
                    padding: 2.5rem 2rem;
                    width: 92%; max-width: 380px;
                    box-shadow: 0 25px 60px rgba(0,0,0,0.18);
                    text-align: center;
                    animation: idcard-fade-in 0.35s ease-out;
                }
                .idcard-spinner {
                    width: 56px; height: 56px;
                    border: 4px solid #e2e8f0;
                    border-top-color: var(--color-primary-600, #2563eb);
                    border-radius: 50%;
                    animation: idcard-spin 0.8s linear infinite;
                    margin: 0 auto;
                }
                .idcard-success-ring {
                    width: 72px; height: 72px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto;
                    animation: idcard-pulse 0.6s ease-in-out;
                }
                .idcard-success-check {
                    stroke-dasharray: 30;
                    stroke-dashoffset: 30;
                    animation: idcard-check-draw 0.4s 0.2s ease-out forwards;
                }
                .idcard-error-ring {
                    width: 72px; height: 72px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto;
                    animation: idcard-pulse 0.6s ease-in-out;
                }
            `}</style>

      {/* ── Generating / Success / Error Modal ── */}
      {showModal && (
        <div className="idcard-modal-backdrop">
          <div className="idcard-modal-card">
            {modalPhase === "generating" && (
              <>
                <div className="idcard-spinner" />
                <h3
                  style={{
                    marginTop: 20,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1e293b",
                  }}
                >
                  Uploading Assets…
                </h3>
                <p style={{ marginTop: 6, fontSize: 14, color: "#64748b" }}>
                  Please wait while we prepare your card.
                </p>
              </>
            )}

            {modalPhase === "success" && (
              <>
                <div className="idcard-success-ring">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      className="idcard-success-check"
                      d="M5 13l4 4L19 7"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  style={{
                    marginTop: 20,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1e293b",
                  }}
                >
                  ID Card Generated!
                </h3>
                <p style={{ marginTop: 6, fontSize: 14, color: "#64748b" }}>
                  Your card is ready to download.
                </p>
              </>
            )}

            {modalPhase === "error" && (
              <>
                <div className="idcard-error-ring">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  style={{
                    marginTop: 20,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1e293b",
                  }}
                >
                  Generation Failed
                </h3>
                <p style={{ marginTop: 6, fontSize: 14, color: "#64748b" }}>
                  Something went wrong. Please try again.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyItems: "center",
                    justifyContent: "center",
                    marginTop: 20,
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </Button>
                  <Button size="sm" onClick={handleAssetsUpload}>
                    Retry
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Back navigation */}
        <button
          onClick={() => navigate(ROUTE_PATHS.ID_CARD)}
          className="flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-primary-600 transition-colors mb-6 cursor-pointer"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to ID Card Dashboard
        </button>

        {/* header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 shadow-lg shadow-primary-500/20">
            <span className="text-2xl font-bold text-white">ID</span>
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-surface-900">
            ID Card Generation
          </h1>
          <p className="mt-2 text-surface-500">
            Generate your professional community health worker ID card.
          </p>
        </div>

        {/* progress bar */}
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

        {/* Step content */}
        <Card className="mt-8 rounded-2xl">
          <div className="space-y-6">
            {/* Step 1: Verify Details */}
            {currentStep === 0 && (
              <div>
                <h2 className="text-xl font-semibold text-surface-900">
                  Verify Your Details
                </h2>
                <p className="mt-1 text-sm text-surface-500">
                  Please confirm the following information is correct.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Full Name", value: userProfile?.fullName },
                    { label: "Member ID", value: userProfile?.membershipId },
                    { label: "Role", value: userProfile?.userType },
                    { label: "LGA", value: userProfile?.lga },
                    { label: "Issue Date", value: issueDate },
                    { label: "Expiry Date", value: expiryDate },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg bg-surface-50 p-3"
                    >
                      <p className="text-xs font-medium uppercase tracking-wider text-surface-400">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-surface-800">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Upload Passport */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-surface-900">
                  Upload Passport Photo
                </h2>
                <p className="mt-1 text-sm text-surface-500">
                  Upload a recent passport-size photograph with a white
                  background.
                </p>
                <div
                  className={`mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
                    dragActive
                      ? "border-primary-500 bg-primary-50"
                      : passportUrl
                        ? "border-accent-300 bg-accent-50"
                        : "border-surface-300 bg-surface-50 hover:border-surface-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  {passportUrl ? (
                    <>
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent-100">
                        <svg
                          className="h-10 w-10 text-accent-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="mt-3 text-sm font-medium text-accent-700">
                        Photo uploaded successfully!
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setPassportUrl("");
                          setPassportFile(null);
                        }}
                      >
                        Replace Photo
                      </Button>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-12 w-12 text-surface-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-3 text-sm font-medium text-surface-700">
                        Drag & drop your passport photo
                      </p>
                      <p className="text-xs text-surface-500">
                        JPG or PNG, max 2MB
                      </p>
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={triggerFileDialog}
                        >
                          Choose File
                        </Button>
                        <input
                          id="passport-upload-input"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileInput}
                          aria-label="Upload passport photo"
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          ref={fileInputRef as any}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Draw Signature */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-surface-900">
                  Your Signature
                </h2>
                <p className="mt-1 text-sm text-surface-500 font-normal">
                  Draw your signature inside the area below. This signature will
                  be displayed on the front of your ID card.
                </p>
                <div className="mt-6">
                  <SignaturePad
                    onChange={(val) => setSignatureUrl(val)}
                    initialValue={signatureUrl}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Preview ID Card */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-surface-900">
                  Preview ID Card
                </h2>
                <p className="mt-1 text-sm text-surface-500 font-normal">
                  Review your ID card before generating the final version.
                </p>
                <div className="mt-8 flex flex-col items-center gap-6">
                  {/* Flip Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="flex items-center gap-2"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                    {isFlipped ? "View Front" : "View Back"}
                  </Button>

                  {/* 3D Flip Card Container */}
                  <div className="card-flip-container">
                    <div
                      className={`card-flip-inner ${isFlipped ? "flipped" : ""}`}
                    >
                      {/* Front Side */}
                      <div
                        ref={frontCardRef}
                        className="card-side card-front"
                        style={{
                          width: `${idConfig.card.dimensions.width / 3}px`,
                          height: `${idConfig.card.dimensions.height / 3}px`,
                        }}
                      >
                        <div
                          className="overflow-hidden rounded-xl shadow-lg h-full"
                          style={{
                            backgroundImage: `url(${frontBg})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            position: "relative",
                          }}
                        >
                          {/* Photo on front card */}
                          <div
                            style={{
                              position: "absolute",
                              left: `${idConfig.front.memberPhoto.position.x / 2.9}px`,
                              top: `${idConfig.front.memberPhoto.position.y / 1.5}px`,
                              width: `${idConfig.front.memberPhoto.position.width / 3}px`,
                              height: `${idConfig.front.memberPhoto.position.height / 3}px`,
                              borderRadius: "50%",
                              overflow: "hidden",
                              border: `4px solid ${idConfig.front.photoFrame.borderColor}`,
                              backgroundColor: "#f0f0f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "10px",
                              fontWeight: "bold",
                              color: "#666",
                            }}
                          >
                            <img
                              src={passportUrl}
                              style={{
                                width: "140%",
                                height: "140%",
                                objectFit: "cover",
                              }}
                            />
                          </div>

                          {/* Member Name */}
                          <div
                            style={{
                              position: "absolute",
                              width: "100%",
                              top: `${idConfig.front.memberName.position.y / 3}px`,
                              textAlign: "center",
                              color: idConfig.front.memberName.color,
                              fontSize: "15px",
                              fontWeight: "700",
                              paddingLeft: "4px",
                              paddingRight: "4px",
                            }}
                          >
                            {userProfile?.fullName}
                          </div>

                          {/* Role Badge */}
                          <div
                            style={{
                              position: "absolute",
                              left: "50%",
                              transform: "translateX(-50%)",
                              top: `${idConfig.front.roleBadge.position.y / 4}px`,
                              backgroundColor:
                                idConfig.front.roleBadge.background,
                              color: idConfig.front.roleBadge.text.color,
                              padding: "1px 8px",
                              borderRadius: "9px",
                              fontSize: "8px",
                              fontWeight: "600",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {userProfile?.userType}
                          </div>

                          {/* Details on front */}
                          <div
                            style={{
                              position: "absolute",
                              right: `${idConfig.front.details.position.x / 1}px`,
                              bottom: `${idConfig.front.details.position.y / 7.6}px`,
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            <div
                              style={{
                                marginBottom: "4px",
                                color: idConfig.front.details.color,
                              }}
                            >
                              Phone No: {userProfile?.phone || "08065550000"}
                            </div>
                            <div
                              style={{
                                marginBottom: "4px",
                                color: idConfig.front.details.color,
                              }}
                            >
                              Reg No: {userProfile?.membershipId}
                            </div>
                            <div
                              style={{ color: idConfig.front.details.color }}
                            >
                              L.G.A: {userProfile?.lga}
                            </div>
                          </div>

                          {/* Signature on front card */}
                          {signatureUrl && (
                            <div
                              style={{
                                position: "absolute",
                                left: "20px",
                                bottom: "25px",
                                width: "50px",
                                height: "25px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={signatureUrl}
                                style={{
                                  width: "100%",
                                  height: "18px",
                                  objectFit: "contain",
                                }}
                              />
                              <span
                                style={{
                                  fontSize: "4px",
                                  color: "#64748b",
                                  marginTop: "1px",
                                }}
                              >
                                Signature
                              </span>
                            </div>
                          )}

                          {/* Barcode */}
                          <div
                            style={{
                              position: "absolute",
                              right: `${idConfig.front.barcode.position.x / 3}px`,
                              bottom: `${idConfig.front.barcode.position.y / 3}px`,
                              width: `${idConfig.front.barcode.position.width / 3}px`,
                              height: `${idConfig.front.barcode.position.height / 3}px`,
                            }}
                          >
                            <QRCode
                              value={`${userProfile?.fullName},${userProfile?.userType}`}
                              size={idConfig.front.barcode.position.width / 3}
                              fgColor={idConfig.front.barcode.colors.dark}
                              bgColor={idConfig.front.barcode.colors.light}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Back Side */}
                      <div
                        ref={backCardRef}
                        className="card-side card-back"
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: `${idConfig.card.dimensions.width / 3}px`,
                          height: `${idConfig.card.dimensions.height / 3}px`,
                        }}
                      >
                        <div
                          className="overflow-hidden rounded-xl shadow-lg h-full"
                          style={{
                            backgroundImage: `url(${backBg})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            position: "relative",
                          }}
                        >
                          {/* Issue Date */}
                          <div
                            style={{
                              position: "absolute",
                              left: "15px",
                              bottom: `${250 / 3}px`,
                              fontSize: "9px",
                              color:
                                idConfig.back.dates.issueDate.color ||
                                "#111111",
                            }}
                          >
                            <div className="underline font-bold">
                              {issueDate}
                            </div>
                            <div
                              style={{ fontWeight: "700", marginBottom: "2px" }}
                            >
                              Issue Date
                            </div>
                          </div>

                          {/* Expiry Date */}
                          <div
                            style={{
                              position: "absolute",
                              right: "15px",
                              bottom: `${250 / 3}px`,
                              fontSize: "9px",
                              color:
                                idConfig.back.dates.expiredDate.color ||
                                "#111111",
                              textAlign: "right",
                            }}
                          >
                            <div className="underline font-bold">
                              {expiryDate}
                            </div>
                            <div
                              style={{ fontWeight: "700", marginBottom: "2px" }}
                            >
                              Expiry Date
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {currentStep < 4 && (
              <div className="mt-8 border-t border-surface-100 pt-4">
                <div className="flex flex-row justify-between gap-3">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                  >
                    ← Back
                  </Button>
                  <Button
                    onClick={
                      currentStep === 3
                        ? () => handleAssetsUpload()
                        : handleNext
                    }
                    disabled={
                      (currentStep === 1 && !passportUrl) ||
                      (currentStep === 2 && !signatureUrl)
                    }
                  >
                    {currentStep === 3 ? "Upload Assets" : "Continue →"}
                  </Button>
                </div>
              </div>
            )}
            {/* end space-y-6 */}
          </div>
        </Card>
      </div>

      {/* Hidden container for PDF generation */}
      <div
        style={{ position: "absolute", left: "-9999px", top: 0 }}
        className="flex flex-row gap-10 items-center"
        ref={idCardRef}
      >
        <div
          style={{
            width: idConfig.card.dimensions.width,
            height: idConfig.card.dimensions.height,
            backgroundColor: "white",
          }}
        >
          <div
            className="overflow-hidden rounded-xl shadow-lg h-full"
            style={{
              backgroundImage: `url(${frontBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            {/* Photo on front card */}
            <div
              style={{
                position: "absolute",
                left: `${idConfig.front.memberPhoto.position.x / 1}px`,
                top: `${idConfig.front.memberPhoto.position.y / 0.6}px`,
                width: `${idConfig.front.memberPhoto.position.width / 1}px`,
                height: `${idConfig.front.memberPhoto.position.height / 1}px`,
                borderRadius: "50%",
                overflow: "hidden",
                border: `10px solid ${idConfig.front.photoFrame.borderColor}`,
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "bold",
                color: "#666",
              }}
            >
              <img
                src={passportUrl || undefined}
                style={{
                  width: "140%",
                  height: "140%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Member Name */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                top: `${idConfig.front.memberName.position.y / 1.1}px`,
                textAlign: "center",
                color: idConfig.front.memberName.color,
                fontSize: "35px",
                fontWeight: "800",
              }}
              className="tracking-wide"
            >
              {userProfile?.fullName}
            </div>

            {/* Role Badge */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                top: `${idConfig.front.roleBadge.position.y / 1.4}px`,
                backgroundColor: idConfig.front.roleBadge.background,
                color: idConfig.front.roleBadge.text.color,
                padding: "1px 8px",
                borderRadius: "9px",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              <div className="mb-3">{userProfile?.userType}</div>
            </div>

            {/* Details on front */}
            <div
              style={{
                position: "absolute",
                left: `${idConfig.front.details.position.x / 1.2}px`,
                bottom: `${idConfig.front.details.position.y / 2}px`,
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              <div
                style={{
                  marginBottom: "4px",
                  color: idConfig.front.details.color,
                }}
              >
                Phone No: {userProfile?.phone || "08065550000"}
              </div>
              <div
                style={{
                  marginBottom: "4px",
                  color: idConfig.front.details.color,
                }}
              >
                Reg No: {userProfile?.membershipId}
              </div>
              <div style={{ color: idConfig.front.details.color }}>
                L.G.A: {userProfile?.lga}
              </div>
            </div>

            {/* Signature on front card */}
            {signatureUrl && (
              <div
                style={{
                  position: "absolute",
                  left: "60px",
                  bottom: "75px",
                  width: "150px",
                  height: "75px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={signatureUrl}
                  style={{
                    width: "100%",
                    height: "54px",
                    objectFit: "contain",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginTop: "3px",
                  }}
                >
                  Signature
                </span>
              </div>
            )}

            {/* Barcode */}
            <div
              style={{
                position: "absolute",
                right: `110px`,
                bottom: `100px`,
                width: `${idConfig.front.barcode.position.width / 1}px`,
                height: `${idConfig.front.barcode.position.height / 1}px`,
              }}
            >
              <QRCode
                value={`${userProfile?.fullName},${userProfile?.userType}`}
                size={idConfig.front.barcode.position.width / 0.9}
                fgColor={idConfig.front.barcode.colors.dark}
                bgColor={idConfig.front.barcode.colors.light}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            width: idConfig.card.dimensions.width,
            height: idConfig.card.dimensions.height,
          }}
        >
          {/* SAME BACK CONTENT */}
          <div
            className="overflow-hidden rounded-xl shadow-lg h-full"
            style={{
              backgroundImage: `url(${backBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            {/* Issue Date */}
            <div
              style={{
                position: "absolute",
                left: "18px",
                bottom: `${800 / 3}px`,
                fontSize: "25px",
                color: idConfig.back.dates.issueDate.color || "#111111",
              }}
            >
              <div className="underline font-bold">{issueDate}</div>
              <div style={{ fontWeight: "700", marginBottom: "2px" }}>
                Issue Date
              </div>
            </div>

            {/* Expiry Date */}
            <div
              style={{
                position: "absolute",
                right: "18px",
                bottom: `${800 / 3}px`,
                fontSize: "25px",
                color: idConfig.back.dates.expiredDate.color || "#111111",
                textAlign: "right",
              }}
            >
              <div className="underline font-bold">{expiryDate}</div>
              <div style={{ fontWeight: "700", marginBottom: "2px" }}>
                Expiry Date
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
