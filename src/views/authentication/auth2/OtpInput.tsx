import { Label } from 'flowbite-react'; // Keeping Label; let me know if you want that native too

export const OtpInput = ({ otp, handleOtpChange }: any) => {
  return (
    <div>
      <p className="text-ld opacity-80 text-sm font-medium mt-4">
        We sent a verification code to your mobile. Enter the code from the mobile in the field
        below.
      </p>
      <h6 className="text-sm font-bold my-4">******1234</h6>

      <Label htmlFor="otp" className="mb-2 block">
        Enter OTP
      </Label>

      <div className="flex gap-2 mb-4">
        {otp.map((digit: any, idx: number) => (
          <input
            key={idx}
            id={`otp-${idx}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            className="text-center w-12 h-12 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        ))}
      </div>

      <div className="flex gap-2 text-sm font-medium mt-6 items-center justify-left">
        <p>Didn't get the code?</p>
        <div className="text-primary text-sm font-medium cursor-pointer">Resend</div>
      </div>
    </div>
  );
};
