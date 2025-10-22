import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { verifyEmail, sendEmail, loading, error } = useAuthStore();

  const [formData, setFormData] = useState({ email: "", code: "" });
  const [emailSent, setEmailSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!emailSent) return;

    setTimeLeft(180);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [emailSent]);

  const SendhandleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending email:", formData.email);
      setEmailSent(true);
      await sendEmail(formData.email);
    } catch (err) {
      console.error(err);
      setEmailSent(false);
    }
  };

  const VerifyhandleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Verifying code:", formData.code);
      await verifyEmail(formData.code, formData.email);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="auth-container">
      <div className="auth-box w-full max-w-[430px]">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl px-12 py-14">
          <h1 className="text-center mb-6">
            <span className="text-5xl text-brand">GoWhere</span>
          </h1>

          <form className="form-group mb-10" onSubmit={SendhandleSubmit}>
            <Input
              className="mb-1"
              type="text"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={emailSent}
            />

            {emailSent && !error && (
              <div className="text-sm text-blue-500 flex justify-end mt-2 gap-4">
                <p>이메일 전송 완료</p>
                <p
                  className="text-sm text-blue-500 cursor-pointer underline"
                  onClick={() => setEmailSent(false)}
                >
                  이메일 재입력
                </p>
              </div>
            )}

            {!emailSent && error && (
              <p className="text-sm text-red-500 mt-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading || !formData.email || emailSent}
            >
              {loading ? "loading in..." : "인증 번호 전송"}
            </Button>
          </form>

          <form className="form-group mt-4" onSubmit={VerifyhandleSubmit}>
            <Input
              className="mb-1"
              type="text"
              name="code"
              placeholder="Enter verification code"
              value={formData.code}
              onChange={handleChange}
              required
            />

            {emailSent && (
              <div className="flex justify-end mt-2 gap-4">
                <p className="text-sm text-red-500">
                  {timeLeft > 0 ? formatTime(timeLeft) : "시간 초과"}
                </p>
                <p
                  className="text-sm text-blue-500 cursor-pointer underline"
                  onClick={(e) => {
                    e.preventDefault();
                    SendhandleSubmit(e);
                    setTimeLeft(180);
                  }}
                >
                  재발송
                </p>
              </div>
            )}

            <Button
              className="mt-2"
              type="submit"
              disabled={loading || !formData.email || !formData.code}
            >
              {loading ? "loading in..." : "인증하기"}
            </Button>
          </form>

          {emailSent && error && <p className="text-error mt-2">{error}</p>}
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl px-12 py-8 text-center">
          <p className="text-gray-600">
            Once you complete the verification, your account will be activated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
