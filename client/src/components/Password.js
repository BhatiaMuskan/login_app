import React from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import styles from "../styles/Username.module.css";
import { sendOtp } from "../helper/helper";
import { useFormik } from "formik";
import { passwordValidate } from "../helper/Validate";
import useFetch from "../hooks/fetch.hook";
import { useAuthStore } from "../store/store";

export default function Password() {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/api/user/${username}`);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        // Send OTP before login
        const otpPromise = sendOtp(username);
        toast.promise(otpPromise, {
          loading: "Sending OTP...",
          success: <b>OTP sent successfully!</b>,
          error: <b>Failed to send OTP.</b>,
        });

        await otpPromise;
        localStorage.setItem("username", username);
        navigate("/otp");
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Welcome Back</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter your password to receive an OTP.
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="password"
                placeholder="Password"
              />
              <button type="submit" className={styles.btn}>
                Send OTP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
