import { useContext, useState } from 'react';
import CardBox from 'src/components/shared/CardBox';
import { Button, Label, TextInput, Toast } from 'flowbite-react';
// import FullLogo from 'src/layouts/full/shared/logo/FullLogo';
import { organizerSignup, getOtp } from 'src/service/auth';
import { decryptDataFrontend } from 'src/service/deCrypt';
import { Link, useNavigate } from 'react-router';
// import BoxedSocialButtons from '../authforms/BoxedSocialButtons';
import { AuthContext } from 'src/context/authContext/AuthContext';
import { OtpInput } from './OtpInput';

const Register = () => {
  const { login }: any = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    age: '',
    profile_pic:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAJEkJQ1WumU0hXNpXdgBt9NUKc0QDVIiaw&s',
  });

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [apiOtp, setApiOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: enter phone, 2: verify otp, 3: fill details
  const [showInvalidToast, setShowInvalidToast] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!phone) {
      setError('Please enter your phone number.');
      return;
    }

    // Clean phone: keep digits only
    const cleanPhone = (raw: string) => {
      const digits = raw.replace(/\D/g, '');
      if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
      if (digits.length === 10) return digits;
      return null;
    };

    const cleaned = cleanPhone(phone);
    if (!cleaned) {
      setShowInvalidToast(true);
      window.setTimeout(() => setShowInvalidToast(false), 3500);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await getOtp(cleaned);
      setApiOtp(decryptDataFrontend(response?.result));
      setSuccess('OTP sent to your phone.');
      setStep(2);
      // store cleaned phone in formData for signup
      setFormData((prev: any) => ({ ...prev, phone: cleaned }));
    } catch (err: any) {
      setError(err?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    const digits = phone.replace(/\D/g, '');
    let cleaned = null as string | null;
    if (digits.length === 11 && digits.startsWith('0')) cleaned = digits.slice(1);
    else if (digits.length === 10) cleaned = digits;
    if (!cleaned) {
      setShowInvalidToast(true);
      window.setTimeout(() => setShowInvalidToast(false), 3500);
      return;
    }

    setResendLoading(true);
    setError('');
    try {
      const response = await getOtp(cleaned);
      setApiOtp(decryptDataFrontend(response?.result));
      setSuccess('OTP resent to your phone.');
    } catch (err: any) {
      setError(err?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next box
    const nextInput = document.getElementById(`otp-${index + 1}`);
    if (value && nextInput) nextInput.focus();

    if (newOtp.join('') === apiOtp) {
      setSuccess('OTP verified. Please complete your details.');
      setStep(3);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await organizerSignup(formData);
      setSuccess('Signup Successful!');
      login(response?.result);
      navigate('/apps/user-profile/profile');
    } catch (err: any) {
      setError(err?.message || 'Signup failed!');
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center bg-gray-100">
      <div className="flex h-full justify-center items-center px-4">
        <CardBox className="xl:max-w-5xl w-full border-none p-0 shadow-lg bg-white rounded-lg">
          <div className="grid grid-cols-12">
            {/* Left Section - Form */}
            <div className="xl:col-span-6 col-span-12 px-8 xl:border-e border-gray-300">
              <div className="py-14 lg:px-6">
                {/* <FullLogo /> */}
                <h3 className="text-4xl font-semibold my-5 logo-font text-[#b03052]">Create Your Account</h3>
                {showInvalidToast && (
                  <div className="fixed top-5 right-5 z-50">
                    <Toast>
                      <div className="ml-3 text-sm font-normal">Please write a valid phone number</div>
                      <Toast.Toggle onDismiss={() => setShowInvalidToast(false)} />
                    </Toast>
                  </div>
                )}
                {step === 1 && (
                  <div className="">
                    Enter your phone number to receive a verification code (OTP). After verifying
                    your phone, you can complete your registration details.
                  </div>
                )}
                {/* <BoxedSocialButtons title="Or sign up with phone" /> */}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
                <div className="mt-6">
                  {step === 1 && (
                    <>
                      <div className="mb-4 w-full">
                        <Label htmlFor="phone" value="Phone Number" />
                        <TextInput
                          id="phone"
                          name="phone"
                          type="tel"
                          sizing="md"
                          value={phone}
                          onChange={(e: any) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="w-full bg-[#b03052] hover:bg-gray-700 text-white py-1 rounded-md transition"
                      >
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                      </Button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <p className="text-sm mb-4">Enter the 4-digit OTP sent to your phone.</p>
                        <OtpInput otp={otp} handleOtpChange={handleOtpChange} onResend={resendOtp} resendLoading={resendLoading} />
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <form className="mt-6">
                        <div className="mb-4 w-full">
                          <Label htmlFor="email" value="Email Address" />
                          <TextInput
                            id="email"
                            name="email"
                            type="email"
                            sizing="md"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                          />
                        </div>

                        <Button
                          type="button"
                          onClick={handleSignup}
                          disabled={loading}
                                                 className="w-full bg-[#b03052] hover:bg-gray-700 text-white py-1 rounded-md transition"
                        >
                          {loading ? 'Processing...' : 'Sign Up Account'}
                        </Button>
                      </form>
                    </>
                  )}
                </div>
                <div className="flex gap-2 text-sm font-medium mt-6 items-center text-gray-700">
                  <p>Already have an Account?</p>
                  <Link to="/auth/auth2/login" className="text-blue-600 font-semibold">
                    Sign in Now
                  </Link>
                </div>
              </div>
            </div>
            {/* Right Section - Image or Inputs */}
            <div className="xl:col-span-6 col-span-12 flex flex-col justify-center items-center p-8">
              {step === 1 || step === 2 ? (
                <img
                  src={
                    'https://img.freepik.com/free-vector/privacy-policy-concept-illustration_114360-7853.jpg?t=st=1740770398~exp=1740773998~hmac=d1142efdf8858c87eb30efbd6711f0132f2083deefb6822cb78d4af75d624639&w=900'
                  }
                  alt="Signup Illustration"
                  className="w-full max-w-md"
                />
              ) : null}
              {step === 3 && (
                <>
                  <div className="mb-4 w-full">
                    <Label htmlFor="full_name" value="Full Name" />
                    <TextInput
                      id="full_name"
                      name="full_name"
                      type="text"
                      sizing="md"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="mb-4 w-full">
                    <Label htmlFor="age" value="Age" />
                    <TextInput
                      id="age"
                      name="age"
                      type="number"
                      sizing="md"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                    />
                  </div>
                  <div className="mb-4 w-full">
                    <Label htmlFor="phone" value="Phone Number" />
                    <TextInput
                      id="phone"
                      name="phone"
                      type="text"
                      sizing="md"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="mb-4 w-full">
                    <Label htmlFor="address" value="Address" />
                    <TextInput
                      id="address"
                      name="address"
                      type="text"
                      sizing="md"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="mb-4 w-full">
                    <Label htmlFor="password" value="Password" />
                    <TextInput
                      id="password"
                      name="password"
                      type="password"
                      sizing="md"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </CardBox>
      </div>
    </div>
  );
};

export default Register;
