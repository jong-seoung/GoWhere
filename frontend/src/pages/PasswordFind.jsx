import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const PasswordFind = () => {
  const navigate = useNavigate();
  const { changePwCode, changePw, sendEmail, loading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    authCode: "",
    code: "",
  });
  const [emailSent, setEmailSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
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
      const token = await changePwCode(formData.code, formData.email);
      setFormData((prev) => ({ ...prev, authCode: token }));
      setIsVerified(true);
    } catch (err) {
      console.error(err);
    }
  };

  const PasswordhandleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await changePw({
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
        authCode: formData.authCode,
      });
      alert("Password successfully changed!");
      navigate("/login");
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
          <h2 className="text-center mb-6">
            <span className="text-2xl text-brand">비밀번호 찾기</span>
          </h2>

          {!isVerified ? (
            <>
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
                  <p className="text-sm text-red-500 mt-2">{error}</p>
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
            </>
          ) : (
            <>
              <form className="form-group mt-4" onSubmit={PasswordhandleSubmit}>
                <Input
                  className="mb-1"
                  type="password"
                  name="password"
                  placeholder="새 비밀번호"
                  value={formData.password || ""}
                  onChange={handleChange}
                  required
                />
                <Input
                  className="mb-1"
                  type="password"
                  name="password2"
                  placeholder="비밀번호 확인"
                  value={formData.password2 || ""}
                  onChange={handleChange}
                  required
                />
                <Button
                  className="mt-2"
                  type="submit"
                  disabled={
                    loading || !formData.password || !formData.password2
                  }
                >
                  {loading ? "loading in..." : "비밀번호 변경"}
                </Button>
              </form>
            </>
          )}
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl px-12 py-8 text-center">
          <p className="text-gray-600">
            Once you complete the verification, you can change your password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordFind;
