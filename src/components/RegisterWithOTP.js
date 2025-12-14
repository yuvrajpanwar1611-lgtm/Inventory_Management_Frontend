import React, { useState } from "react";
import { useSecureFetch } from "../useSecureFetch"; // ✅ Correct hook import
import { API_ENDPOINTS } from "../config";

const RegisterWithOTP = () => {
  const secureFetch = useSecureFetch(); // ✅ Hook used correctly at top level

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  /* --------------------------------------------------
     SEND OTP
  -------------------------------------------------- */
  const sendOTP = async () => {
    if (!mobile || mobile.length < 10)
      return alert("Enter a valid 10-digit mobile number");

    setLoading(true);

    try {
      await secureFetch(API_ENDPOINTS.SEND_PHONE_OTP, {
        method: "POST",
        body: JSON.stringify({ mobile }),
      });

      alert("OTP sent.");
      setOtpSent(true);
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP");
    }

    setLoading(false);
  };

  /* --------------------------------------------------
     VERIFY OTP
  -------------------------------------------------- */
  const verifyOTP = async () => {
    if (!otp) return alert("Enter OTP");

    setLoading(true);

    try {
      const res = await secureFetch(API_ENDPOINTS.VERIFY_PHONE_OTP, {
        method: "POST",
        body: JSON.stringify({ mobile, otp: Number(otp) }),
      });

      const data = await res.json();

      if (data.verified) {
        alert("✅ Mobile Verified Successfully!");
        setVerified(true);
      } else {
        alert("❌ Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Verification failed");
    }

    setLoading(false);
  };

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  return (
    <div className="container mt-4" style={{ maxWidth: "400px" }}>
      <h3 className="mb-3 text-center">Mobile OTP Verification</h3>

      {/* Mobile Input */}
      <input
        id="mobile"
        name="mobile"
        className="form-control mb-3"
        placeholder="Enter Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        required
      />

      {/* Send OTP Button */}
      {!otpSent && (
        <button
          className="btn btn-primary w-100"
          onClick={sendOTP}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      )}

      {/* OTP Input + Verify */}
      {otpSent && !verified && (
        <>
          <input
            id="otp"
            name="otp"
            className="form-control mt-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button
            className="btn btn-success w-100 mt-2"
            onClick={verifyOTP}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {/* Success */}
      {verified && (
        <div className="alert alert-success mt-3 text-center">
          ✅ Mobile Verified
        </div>
      )}
    </div>
  );
};

export default RegisterWithOTP;
