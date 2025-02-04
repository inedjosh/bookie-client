import { useNavigate } from "react-router-dom";
import { useRequestError } from "../../components/Hooks/useRequestError";
import { Button } from "../../components/Buttons";
import {
  ResendOtpRequest,
  VerifyEmailRequest,
} from "../../services/auth.service";
import { useEffect, useState } from "react";
import { OTP_TYPE } from "../../constants";
import OtpInput from "react-otp-input";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";

function VerifyEmail() {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [seconds, setSeconds] = useState(120);
  const { handleRequestError } = useRequestError({ useToast: true });
  const { otpData } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [seconds]);

  const resendOtp = async () => {
    try {
      setIsResending(true);
      if (otpData.type === OTP_TYPE.EMAIL) {
        await ResendOtpRequest({
          email: otpData.email,
          otp_type: OTP_TYPE.EMAIL,
        });
      } else {
        await ResendOtpRequest({
          email: otpData.email,
          otp_type: OTP_TYPE.FORGOT_PASSWORD,
        });
      }
      setSeconds(120);
    } catch (error) {
      handleRequestError(error);
      setIsResending(false);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const otpValue = otp.join("");
      if (otpValue.length === 0) {
        setError("OTP is required");
        return;
      }
      if (otpValue.length < 6) {
        setError("OTP must be 6 digits");
        return;
      }
      setError("");
      const data = {
        email: otpData.email,
        otp: otpValue,
        otp_type: otpData.type,
      };
      await VerifyEmailRequest(data);

      toast.success("Email verified successfully");
      if (otpData.type !== OTP_TYPE.EMAIL) {
        navigate("/reset-password");
      } else {
        navigate("/login");
      }
    } catch (error) {
      handleRequestError(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className=" flex justify-center w-full">
        <form
          onSubmit={handleSubmit}
          className=" w-[90%] md:w-[80%] flex flex-col justify-center items-center"
        >
          <div className="flex-col justify-center w-[95%] md:w-[80%] items-center">
            <h3 className="text-primary-blue text-2xl font-medium text-center py-3">
              Input OTP!
            </h3>
            <p className="text-center font-medium text-sm md:text-sm">
              {otpData.type === OTP_TYPE.EMAIL
                ? "We sent a confirmation code to your provided email address, please enter the code to activate your account"
                : "We sent a confirmation code to your provided email address, please enter the code to reset your password"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center mt-[48px]">
            <OtpInput
              value={otp.join("")}
              onChange={(value) => setOtp(value.split(""))}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  type="number"
                  inputMode="numeric"
                  className="otp-input focus:outline-none border focus:border-primary-gray focus:bg-[##2C50EE]/30"
                  style={{
                    width: "32px",
                    height: "32px",
                    fontSize: "1.5rem",
                    margin: "0 0.5rem",
                    borderRadius: "0.25rem",
                    textAlign: "center",
                  }}
                />
              )}
            />
            <div className="flex w-full justify-start">
              {error && (
                <p className=" text-xs font-latoRegular text-primary-red mt-2 ">
                  {error}
                </p>
              )}
            </div>
          </div>
          <div className="w-full mt-8">
            <Button
              color="primary-blue"
              disabled={loading}
              loading={loading}
              type="submit"
            >
              Continue
            </Button>
          </div>
          <div className="flex w-full mt-5 justify-center items-center">
            <span className="text-black text-xs pr-2">
              Resend OTP code in{" "}
              {seconds > 0 ? (
                <span className="text-primary-blue">{` ${seconds
                  .toString()
                  .padStart(2, "0")} Sec`}</span>
              ) : (
                <span
                  className=" underline text-primary-blue text-xs"
                  role="button"
                  onClick={resendOtp}
                >
                  {isResending ? "Resending..." : "Click to resend"}
                </span>
              )}
            </span>{" "}
          </div>

          <div className="flex justify-center  w-full  mt-5 "></div>
        </form>
      </div>
      <div></div>
    </>
  );
}

export default VerifyEmail;
