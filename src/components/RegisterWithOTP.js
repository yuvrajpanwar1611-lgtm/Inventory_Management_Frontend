import React, { useState } from "react";
import axios from "axios";

const RegisterWithOTP = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // ========================
  // SEND OTP
  // ========================
  const sendOTP = async () => {
    if (!mobile || mobile.length < 10)
      return alert("Enter a valid mobile number");

    setLoading(true);

    try {
      await axios.post("https://inventory-management-ero4.onrender.com/send-otp", {
        mobile,
      });

      alert("OTP sent! (Static OTP = 123456)");
      setOtpSent(true);
    } catch (err) {
      alert("Failed to send OTP");
      console.error(err);
    }

    setLoading(false);
  };

  // ========================
  // VERIFY OTP
  // ========================
  const verifyOTP = async () => {
    if (!otp) return alert("Enter OTP");

    setLoading(true);

    try {
      const res = await axios.post(
        "https://inventory-management-ero4.onrender.com/verify-otp",
        { mobile, otp: Number(otp) }
      );

      if (res.data.verified) {
        alert("✅ Mobile Verified Successfully!");
        setVerified(true);
      } else {
        alert("❌ Invalid OTP");
      }
    } catch (err) {
      alert("Verification failed");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "400px" }}>
      <h3 className="mb-3 text-center">Mobile OTP Verification</h3>

      {/* MOBILE INPUT */}
      <input
        id="mobile"
        name="mobile"
        className="form-control mb-3"
        placeholder="Enter Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        required
      />

      {/* SEND OTP BUTTON */}
      {!otpSent && (
        <button
          className="btn btn-primary w-100"
          onClick={sendOTP}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      )}

      {/* OTP INPUT + VERIFY BUTTON */}
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

      {/* SUCCESS MESSAGE */}
      {verified && (
        <div className="alert alert-success mt-3 text-center">
          ✅ Mobile Verified
        </div>
      )}
    </div>
  );
};

export default RegisterWithOTP;
