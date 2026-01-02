import { useState, useContext } from 'react';
import CardBox from 'src/components/shared/CardBox';
import { updateOrganizerProfile } from 'src/service/auth';
import { AuthContext } from 'src/context/authContext/AuthContext';
import { toast } from 'react-toastify';
import Loader from 'src/components/shared/Loader';
import { Icon } from '@iconify/react';

interface BankDetailsType {
  PAN: string;
  GST: string;
  bank_account: string;
  bank_account_type: string;
  IFSC_code: string;
}

const BankDetails = () => {
  const { user, login } = useContext<any>(AuthContext);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetailsType>({
    PAN: user?.PAN || '',
    GST: user?.GST || '',
    bank_account: user?.bank_account || '',
    bank_account_type: user?.bank_account_type || '',
    IFSC_code: user?.IFSC_code || '',
  });

  const handleChange = (e: any) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await updateOrganizerProfile(user?._id, bankDetails);
      login(response?.result);
      toast.success('Bank details updated successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setStep(1);
    } catch (error) {
      console.error('Error updating bank details:', error);
      alert('Failed to update bank details.');
    } finally {
      setLoading(false);
    }
  };



  const steps = [
    { number: 1, title: 'Bank Account', subtitle: 'Account & IFSC' },
    { number: 2, title: 'Tax Information', subtitle: 'PAN & GST Details' },
  ];

  return (
    <div className="w-full">
      {/* Security Header Banner */}


      {/* Verification Status Cards */}


      {/* Main Form Card */}
      <CardBox className="w-full">
        <div className="p-2">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Icon icon="solar:wallet-money-bold-duotone" height={28} className="text-[#b03052]" />
                Financial Information
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Complete your tax and banking details for seamless transactions
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <>
              {/* Enhanced Step Progress */}
              <div className="relative mb-8">
                <div className="flex items-center justify-between">
                  {steps.map((s, index) => (
                    <div key={s.number} className="flex-1 relative">
                      <div className="flex items-center">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base transition-all duration-300 ${step === s.number
                            ? 'bg-gradient-to-br from-[#b03052] to-[#8a2542] text-white shadow-lg shadow-[#b03052]/30'
                            : step > s.number
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                            }`}
                        >
                          {step > s.number ? (
                            <Icon icon="solar:check-circle-bold" height={24} />
                          ) : (
                            s.number
                          )}
                        </div>
                        <div className="ml-3">
                          <p className={`font-semibold text-sm ${step === s.number ? 'text-[#b03052]' : 'text-gray-600 dark:text-gray-400'
                            }`}>
                            {s.title}
                          </p>
                          <p className="text-xs text-gray-400">{s.subtitle}</p>
                        </div>
                      </div>
                      {/* Connector Line */}
                      {index < steps.length - 1 && (
                        <div className="absolute top-6 left-14 right-0 h-0.5 -z-10">
                          <div className={`h-full transition-all duration-500 ${step > s.number ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
                            }`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Bank Account */}
              {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Bank Card Preview - LEFT */}
                  <div className="flex items-center justify-center">
                    <div className="w-full max-w-sm">
                      {/* Virtual Bank Card */}
                      <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-6 shadow-2xl overflow-hidden">
                        {/* Card Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                        </div>

                        {/* Card Content */}
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-8">
                            <Icon icon="solar:wallet-bold" height={32} className="text-[#b03052]" />
                            <div className="flex gap-1">
                              <div className="w-8 h-8 bg-red-500 rounded-full opacity-80" />
                              <div className="w-8 h-8 bg-yellow-500 rounded-full opacity-80 -ml-3" />
                            </div>
                          </div>

                          <div className="mb-6">
                            <p className="text-gray-400 text-xs mb-1">Account Number</p>
                            <p className="text-white font-mono text-xl tracking-widest">
                              {bankDetails.bank_account
                                ? `**** **** ${bankDetails.bank_account.slice(-4) || '****'}`
                                : '**** **** **** ****'
                              }
                            </p>
                          </div>

                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-gray-400 text-xs mb-1">IFSC</p>
                              <p className="text-white font-mono tracking-wider text-sm">
                                {bankDetails.IFSC_code || 'XXXXXXX0000'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-xs mb-1">Type</p>
                              <p className="text-white text-sm capitalize">
                                {bankDetails.bank_account_type || 'Account'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Security Note */}
                      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                        <Icon icon="solar:lock-bold" height={14} />
                        <span>Your data is secured with bank-level encryption</span>
                      </div>
                    </div>
                  </div>

                  {/* Input Fields - RIGHT */}
                  <div className="space-y-5">
                    {/* Bank Account */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Icon icon="solar:wallet-bold" height={18} className="text-[#b03052]" />
                        Bank Account Number
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="bank_account"
                          value={bankDetails.bank_account}
                          onChange={(e) => setBankDetails({ ...bankDetails, bank_account: e.target.value })}
                          placeholder="Enter account number"
                          className="w-full px-4 py-2 pl-12 border-2 border-gray-200 text-black/70 dark:border-gray-600 dark:bg-gray-800 rounded-xl focus:border-[#b03052] focus:ring-2 focus:ring-[#b03052]/20 transition-all font-mono text-base tracking-wider"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <Icon icon="solar:wallet-outline" height={20} className="text-gray-400" />
                        </div>
                        {bankDetails.bank_account.length >= 9 && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Icon icon="solar:check-circle-bold" height={20} className="text-emerald-500" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Account Type */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Icon icon="solar:folder-bold" height={18} className="text-[#b03052]" />
                        Account Type
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="bank_account_type"
                          value={bankDetails.bank_account_type}
                          onChange={(e) => setBankDetails({ ...bankDetails, bank_account_type: e.target.value })}
                          className="w-full px-4 py-2 pl-12 text-black/70 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-xl focus:border-[#b03052] focus:ring-2 focus:ring-[#b03052]/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select Account Type</option>
                          <option value="savings">Savings Account</option>
                          <option value="current">Current Account</option>
                          <option value="salary">Salary Account</option>
                          <option value="business">Business Account</option>
                        </select>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <Icon icon="solar:folder-outline" height={20} className="text-gray-400" />
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <Icon icon="solar:alt-arrow-down-linear" height={20} className="text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* IFSC Code */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Icon icon="solar:buildings-bold" height={18} className="text-[#b03052]" />
                        IFSC Code
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="IFSC_code"
                          value={bankDetails.IFSC_code}
                          onChange={handleChange}
                          maxLength={11}
                          placeholder="SBIN0001234"
                          className="w-full px-4 py-2 pl-12 border-2 border-gray-200 text-black/70 dark:border-gray-600 dark:bg-gray-800 rounded-xl focus:border-[#b03052] focus:ring-2 focus:ring-[#b03052]/20 transition-all font-mono text-base tracking-wider uppercase"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <Icon icon="solar:buildings-outline" height={20} className="text-gray-400" />
                        </div>
                        {bankDetails.IFSC_code.length === 11 && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Icon icon="solar:check-circle-bold" height={20} className="text-emerald-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        <Icon icon="solar:info-circle-outline" height={14} />
                        11-character bank branch code
                      </p>
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => setStep(2)}
                      disabled={!bankDetails.bank_account || !bankDetails.IFSC_code || !bankDetails.bank_account_type}
                      className="w-full mt-4 bg-gradient-to-r from-[#b03052] to-[#8a2542] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#b03052]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Tax Details
                      <Icon icon="solar:arrow-right-linear" height={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Tax Information */}
              {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-7">
                    {/* PAN Input */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Icon icon="solar:card-bold" height={18} className="text-[#b03052]" />
                        PAN Number
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="PAN"
                          value={bankDetails.PAN}
                          onChange={handleChange}
                          maxLength={10}
                          placeholder="ABCDE1234F"
                          className="w-full px-4 py-2 pl-12 border-2 border-gray-200 text-black/70 dark:border-gray-600 dark:bg-gray-800
                           rounded-xl focus:border-[#b03052] focus:ring-2 focus:ring-[#b03052]/20 transition-all font-mono text-base tracking-wider uppercase"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <Icon icon="solar:card-outline" height={20} className="text-gray-400" />
                        </div>
                        {bankDetails.PAN.length === 10 && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Icon icon="solar:check-circle-bold" height={20} className="text-emerald-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        <Icon icon="solar:info-circle-outline" height={14} />
                        10-character alphanumeric PAN number
                      </p>
                    </div>

                    {/* GST Input */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Icon icon="solar:document-bold" height={18} className="text-[#b03052]" />
                        GSTIN Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="GST"
                          value={bankDetails.GST}
                          onChange={handleChange}
                          maxLength={15}
                          placeholder="22AAAAA0000A1Z5"
                          className="w-full px-4 py-2 pl-12 border-2 border-gray-200  text-black/70 dark:border-gray-600 dark:bg-gray-800 rounded-xl focus:border-[#b03052] focus:ring-2 focus:ring-[#b03052]/20 transition-all font-mono text-base tracking-wider uppercase"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <Icon icon="solar:document-outline" height={20} className="text-gray-400" />
                        </div>
                        {bankDetails.GST.length === 15 && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Icon icon="solar:check-circle-bold" height={20} className="text-emerald-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1 mb-6">
                        <Icon icon="solar:info-circle-outline" height={14} />
                        15-character GST Identification Number (Optional)
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                      >
                        <Icon icon="solar:arrow-left-linear" height={20} />
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!bankDetails.PAN}
                        className="flex-[2] bg-gradient-to-r from-[#b03052] to-[#8a2542] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#b03052]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Icon icon="solar:shield-check-bold" height={20} />
                        Save & Verify
                      </button>
                    </div>
                  </div>

                  {/* Info Panel */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-2xl shadow-lg mx-auto flex items-center justify-center mb-4">
                        <Icon icon="solar:shield-user-bold-duotone" height={48} className="text-[#b03052]" />
                      </div>
                      <h3 className="font-bold text-base text-gray-800 dark:text-white">Why We Need This?</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon icon="solar:verified-check-bold" height={16} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-800 dark:text-gray-200">Tax Compliance</p>
                          <p className="text-xs text-gray-500">Required for TDS deduction and filing</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon icon="solar:bill-list-bold" height={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-800 dark:text-gray-200">GST Invoicing</p>
                          <p className="text-xs text-gray-500">Generate GST-compliant invoices</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon icon="solar:lock-bold" height={16} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-800 dark:text-gray-200">Secure Storage</p>
                          <p className="text-xs text-gray-500">End-to-end encrypted data</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </CardBox>

      <div className="bg-gradient-to-r  mt-8 from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
            <Icon icon="solar:shield-check-bold" className="text-emerald-600 dark:text-emerald-400" height={22} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">Bank-Grade Security</h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Your financial data is encrypted and securely stored</p>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="logos:visa" height={20} />
            <Icon icon="logos:mastercard" height={20} />
            <div className="w-px h-6 bg-emerald-300 dark:bg-emerald-700" />
            <Icon icon="solar:lock-bold" className="text-emerald-600 dark:text-emerald-400" height={16} />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">256-bit SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
