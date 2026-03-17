import { useState, useCallback, useRef, useEffect } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import type { IDCardData } from "@/types/models";
import idConfig from "@/helpers/id.config.json";
import frontBg from "@/assets/front.png";
import backBg from "@/assets/back.png";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { useAuth } from "@/hooks/useAuth";
import { getIssueAndExpiryDate } from "@/helpers/helpers";
import { createOPayCheckout } from "@/services/paymentService";
import type { OPayCheckoutRequest } from "@/types/payment";

const STEPS = ["Verify", "Upload", "Preview", "Payment", "Download"];

const DUMMY_DATA: IDCardData = {
  fullName: "Aisha Bello",
  memberId: "KYC-2024-0847",
  role: "Students",
  state: "Katsina",
  lga: "Katsina",
  passportUrl: "",
  issueDate: "March 2026",
  expiryDate: "March 2028",
};

export default function IDCardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [passportUrl, setPassportUrl] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalPhase, setModalPhase] = useState<"generating" | "success" | "error">("generating");
  const [paymentMethod, setPaymentMethod] = useState<"BankUssd" | "OpayWallet" | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);
  const idCardRef = useRef<HTMLDivElement>(null);

  const { userProfile } = useAuth();
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

  const handleGenerateCard = () => {
    setShowModal(true);
    setModalPhase("generating");
  };

  // Drive the modal phases
  useEffect(() => {
    if (!showModal) return;
    if (modalPhase === "generating") {
      const timer = setTimeout(() => {
        // Simulate generation — swap to success
        setModalPhase("success");
      }, 2200);
      return () => clearTimeout(timer);
    }
    if (modalPhase === "success") {
      const timer = setTimeout(() => {
        setShowModal(false);
        setCurrentStep(3); // advance to Payment step
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [showModal, modalPhase]);

  // Handle return from OPay
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const reference = params.get("reference");

    // OPay usually returns status=SUCCESS or similar, or we can just check if we have a reference
    // This is a simplified check for the demo/implementation
    if (status === "SUCCESS" || (reference && reference.startsWith("ID-"))) {
      setHasPaid(true);
      setCurrentStep(4);
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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
      const url = URL.createObjectURL(file);
      setPassportUrl(url);
    }
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
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

  const generateA4PDF = async () => {
    if (!idCardRef.current) return;

    try {
      // Capture the hidden container
      const canvas = await html2canvas(idCardRef.current, {
        scale: 4, // High resolution
        useCORS: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1);

      // Create A4 PDF (portrait)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Convert canvas pixels to ratio
      const imgWidth = pageWidth - 30; // 10mm margin each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const yPosition = (pageHeight - imgHeight) / 2;

      pdf.addImage(imgData, "JPEG", 10, yPosition, imgWidth, imgHeight);

      pdf.save(`ID_Card_${DUMMY_DATA.memberId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentMethod) return;
    setPaymentProcessing(true);

    try {
      const reference = `ID-${Date.now()}-${userProfile?.membershipId || "REF"}`;

      const checkoutRequest: OPayCheckoutRequest = {
        amount: {
          currency: "NGN",
          total: 1000,
        },
        callbackUrl: `${window.location.origin}/payment-callback`,
        cancelUrl: window.location.href,
        country: "NG",
        customerVisitSource: "WEB",
        evokeOpay: true,
        expireAt: Date.now() + 5 * 60 * 1000,
        sn: reference,
        payMethod: paymentMethod,
        product: {
          description: "Community Health Worker ID Card Generation Fee",
          name: "ID Card Generation",
        },
        reference: reference,
        returnUrl: `${window.location.origin}/payment-success`, // ✅ FIXED
        userInfo: {
          userEmail: userProfile?.email || "user@example.com",
          userId: userProfile?.uid || "userid001",
          userMobile: userProfile?.phone || "08000000000",
          userName: userProfile?.fullName || "User",
        },
      };

      const response = await createOPayCheckout(checkoutRequest);

      if (response.data?.cashierUrl) {
        // Redirect to OPay cashier
        window.location.href = response.data.cashierUrl;
      } else {
        throw new Error("Cashier URL not found in response");
      }
    } catch (error) {
      console.error("OPay checkout failed:", error);
      alert("Failed to initiate payment. Please try again.");
      setPaymentProcessing(false);
    }
  }

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
                <h3 style={{ marginTop: 20, fontSize: 18, fontWeight: 700, color: "#1e293b" }}>
                  Generating your ID Card…
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
                <h3 style={{ marginTop: 20, fontSize: 18, fontWeight: 700, color: "#1e293b" }}>
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
                    <path d="M6 18L18 6M6 6l12 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 style={{ marginTop: 20, fontSize: 18, fontWeight: 700, color: "#1e293b" }}>
                  Generation Failed
                </h3>
                <p style={{ marginTop: 6, fontSize: 14, color: "#64748b" }}>
                  Something went wrong. Please try again.
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
                  <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                  <Button size="sm" onClick={handleGenerateCard}>
                    Retry
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-16">
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
                  className={`mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${dragActive
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
                        onClick={() => setPassportUrl("")}
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

            {/* Step 3: Preview ID Card */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-surface-900">
                  Preview ID Card
                </h2>
                <p className="mt-1 text-sm text-surface-500">
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
                              // rotate: '45deg'
                            }}
                          >
                            <img
                              src={passportUrl}
                              style={{
                                width: "140%",
                                height: "140%",
                                objectFit: "cover",
                                //   transform: "rotate(-45deg)"
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
                            className=""
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

            {/* Step 4: Payment */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-surface-900">Complete Payment</h2>
                <p className="mt-1 text-sm text-surface-500">
                  A one-time fee is required to generate your ID card.
                </p>

                {/* Amount card */}
                <div className="mt-6 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 p-5 text-white shadow-lg shadow-primary-500/20">
                  <p className="text-sm font-medium opacity-80">Amount Due</p>
                  <p className="mt-1 text-4xl font-extrabold tracking-tight">₦1,000</p>
                  <p className="mt-1 text-xs opacity-70">One-time ID Card Generation Fee</p>
                </div>

                {/* Payment method selector */}
                <p className="mt-6 text-sm font-medium text-surface-700">Select payment method</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {/* Bank USSD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("BankUssd")}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${paymentMethod === "BankUssd"
                      ? "border-primary-500 bg-primary-50 shadow-sm"
                      : "border-surface-200 bg-surface-50 hover:border-surface-300"
                      }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === "BankUssd" ? "bg-primary-100" : "bg-surface-100"
                      }`}>
                      <svg className={`h-5 w-5 ${paymentMethod === "BankUssd" ? "text-primary-600" : "text-surface-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className={`text-sm font-medium ${paymentMethod === "BankUssd" ? "text-primary-700" : "text-surface-600"
                      }`}>Bank USSD</span>
                  </button>

                  {/* OPay Wallet */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("OpayWallet")}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${paymentMethod === "OpayWallet"
                      ? "border-primary-500 bg-primary-50 shadow-sm"
                      : "border-surface-200 bg-surface-50 hover:border-surface-300"
                      }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === "OpayWallet" ? "bg-primary-100" : "bg-surface-100"
                      }`}>
                      <svg className={`h-5 w-5 ${paymentMethod === "OpayWallet" ? "text-primary-600" : "text-surface-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className={`text-sm font-medium ${paymentMethod === "OpayWallet" ? "text-primary-700" : "text-surface-600"
                      }`}>OPay Wallet</span>
                  </button>
                </div>

                {/* Payment note */}
                {paymentMethod && (
                  <div className="mt-4 rounded-xl border border-surface-200 bg-surface-50 p-4 text-sm text-surface-600">
                    <p className="font-semibold text-surface-700 mb-1">
                      {paymentMethod === "BankUssd" ? "USSD Payment" : "OPay Wallet Payment"}
                    </p>
                    <p className="text-xs">You will be redirected to a secure OPay checkout page to complete your ₦1,000 payment.</p>
                  </div>
                )}

                {/* Confirm payment */}
                {paymentMethod && (
                  <Button
                    className="mt-5 w-full"
                    disabled={paymentProcessing}
                    onClick={handleConfirmPayment}
                  >
                    {paymentProcessing ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                        <span className="idcard-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                        Processing…
                      </span>
                    ) : (
                      "Confirm Payment  →"
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Step 5: Download */}
            {currentStep === 4 && (
              <div className="text-center py-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-100">
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
                <h2 className="mt-4 text-xl font-bold text-surface-900">
                  Your ID Card is Ready!
                </h2>
                <p className="mt-2 text-surface-500">
                  Payment confirmed. Your professional ID card is ready to download.
                </p>
                <div className="mt-6 flex flex-col items-center gap-3">
                  <Button
                    size="lg"
                    onClick={generateA4PDF}
                    disabled={isGeneratingPDF}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    {isGeneratingPDF ? "Generating PDF..." : "Download ID Card (PDF)"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(3)}
                  >
                    Back to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation buttons — shown on steps 0, 1, 2 only */}
            {currentStep < 3 && (
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
                    onClick={currentStep === 2 ? handleGenerateCard : handleNext}
                    disabled={currentStep === 1 && !passportUrl}
                  >
                    {currentStep === 2 ? "Generate Card" : "Continue →"}
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
          //   ref={frontCardRef}
          style={{
            width: idConfig.card.dimensions.width,
            height: idConfig.card.dimensions.height,
            backgroundColor: "white",
          }}
        >
          {/* SAME CARD CONTENT AS PREVIEW */}
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
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "bold",
                color: "#666",
                // rotate: '45deg'
              }}
            >
              <img
                src={passportUrl}
                style={{
                  width: "140%",
                  height: "140%",
                  objectFit: "cover",
                  //   transform: "rotate(-45deg)"
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
                // whiteSpace: "nowrap",
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
          //   ref={backCardRef}
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
