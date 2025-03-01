import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import styles from "../styles/Username.module.css";
import { sendOtp, loginWithOtp } from "../helper/helper";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username"); 
  const navigate = useNavigate();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginPromise = loginWithOtp({ username, otp });
    toast.promise(loginPromise, {
      loading: "Verifying OTP...",
      success: <b>Login successful!</b>,
      error: <b>Invalid OTP. Please try again.</b>,
    });

    loginPromise
      .then((res) => {
        localStorage.setItem("token", res.token);
        navigate("/profile");
      })
      .catch(() => setLoading(false));
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <form className="py-1" onSubmit={handleOtpSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                type="text"
                placeholder="Enter OTP"
                className={styles.textbox}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button type="submit" className={styles.btn} disabled={loading}>
                {loading ? "Verifying..." : "Submit OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
