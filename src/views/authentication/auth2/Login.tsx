import { useContext, useState } from 'react';
import CardBox from 'src/components/shared/CardBox';
import BoxedAuthSlider from '../authforms/BoxedAuthSlider';
// import FullLogo from 'src/layouts/full/shared/logo/FullLogo';
import { Button, Label } from 'flowbite-react';
import { useNavigate } from 'react-router';
import { AuthContext } from 'src/context/authContext/AuthContext';
import { OtpInput } from './OtpInput';
import { getOtp, loginOrganizer } from 'src/service/auth';
import { decryptDataFrontend } from 'src/service/deCrypt';

const Login = () => {
  const navigate = useNavigate();
  const { login }: any = useContext(AuthContext);

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [apiOtp, setApiOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await getOtp(phone);
      console.log('OTP sent successfully:', response?.result);
      setShowOtpInput(true);
      setApiOtp(decryptDataFrontend(response?.result));
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await loginOrganizer(phone);
      console.log('Login successful:', response);
      login(response?.result); // Mock login

      navigate('/');
    } catch (error) {
      setError('Login failed');
      console.error('Login error:', error);
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
      handleLogin();
      console.log('apiOtp:', apiOtp);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center bg-cover bg-center bg-gray-100 ">
      <div className="flex h-full justify-center items-center px-4">
        <CardBox className="xl:max-w-6xl lg:max-w-3xl md:max-w-xl w-full border-none p-0 shadow-2xl">
          <div className="grid grid-cols-12">
            <div className="xl:col-span-6 col-span-12 px-8 xl:border-e border-ld">
              <div className="md:py-14 py-8 lg:px-6">
                {/* <FullLogo /> */}
                <div className="text-[#b03052] logo-font font-semibold text-4xl">Hobi App Login</div>
                {/* <h3 className="md:text-34 text-2xl md:mb-2 md:mt-8 my-5">Admin Login</h3> */}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {!showOtpInput ? (
                  <form onSubmit={handlePhoneSubmit}>
                    <p className="text-ld mb-8 opacity-80 text-sm font-medium mt-4">
                      wellcome to Hobi Organizers Portal.
                      Please enter your phone number to receive an OTP for verification.
                    </p>
                    <div className="mb-4">
                      <div className="mb-2 block">
                        <Label htmlFor="phone" value="Phone Number" />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="rounded-md w-full bg-sky dark:bg-sky hover:bg-dark dark:hover:bg-dark"
                      disabled={loading}
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </form>
                ) : (
                  <OtpInput otp={otp} handleOtpChange={handleOtpChange} />
                )}
                            <div className="text-ld mb-8 opacity-80 text-sm font-medium mt-4">
              Dont have an account?{' '}
              <span
                className="text-sky dark:text-sky cursor-pointer"
                onClick={() => navigate('/auth/auth2/register')}
              >
                Register here
              </span>
            </div>
              </div>
              
            </div>


            <div className="xl:col-span-6 w-full col-span-12 xl:block hidden">
              <BoxedAuthSlider />
            </div>
          </div>
        </CardBox>
      </div>
    </div>
  );
};

export default Login;
