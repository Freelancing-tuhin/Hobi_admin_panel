import { useContext, useState, useRef } from 'react';
import { AuthContext } from 'src/context/authContext/AuthContext';
import { uploadOrganizerDocuments } from 'src/service/uploadDocs';
import { Icon } from '@iconify/react';
import Loader from 'src/components/shared/Loader';
import { toast } from 'react-toastify';
import CardBox from 'src/components/shared/CardBox';

// Document types configuration
const documentTypes = [
  {
    key: 'licenses_for_establishment',
    label: 'Licenses for Establishment',
    description: 'Business registration & trade license',
    icon: 'solar:diploma-bold-duotone',
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    key: 'certificate_of_incorporation',
    label: 'Certificate of Incorporation',
    description: 'Company incorporation certificate',
    icon: 'solar:document-medicine-bold-duotone',
    color: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    key: 'licenses_for_activity_undertaken',
    label: 'Activity Licenses',
    description: 'Permits for specific activities',
    icon: 'solar:shield-check-bold-duotone',
    color: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    key: 'certifications',
    label: 'Certifications',
    description: 'Professional certifications & awards',
    icon: 'solar:medal-ribbons-star-bold-duotone',
    color: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    key: 'insurance_for_outdoor_activities',
    label: 'Insurance Documents',
    description: 'Liability & activity insurance',
    icon: 'solar:umbrella-bold-duotone',
    color: 'from-rose-500 to-rose-600',
    bgLight: 'bg-rose-50 dark:bg-rose-900/20',
  },
  {
    key: 'health_safety_documents',
    label: 'Health & Safety',
    description: 'Safety protocols & compliance docs',
    icon: 'solar:heart-pulse-bold-duotone',
    color: 'from-teal-500 to-teal-600',
    bgLight: 'bg-teal-50 dark:bg-teal-900/20',
  },
];

const DocumentUploader = () => {
  const { login, user } = useContext<any>(AuthContext);
  const [files, setFiles] = useState<Record<string, File>>({});
  const [loading, setLoading] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Count uploaded documents
  const uploadedCount = documentTypes.filter(
    (doc) => user?.[doc.key] || files[doc.key]
  ).length;

  const handleFileChange = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setFiles((prev) => ({ ...prev, [key]: file }));
    }
  };

  const handleRemoveFile = (key: string) => {
    setFiles((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const triggerFileInput = (key: string) => {
    fileInputRefs.current[key]?.click();
  };

  const handleUpload = async () => {
    if (Object.keys(files).length === 0) {
      toast.warning('Please select at least one document to upload', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const organizerId = user?._id;
      const response = await uploadOrganizerDocuments(organizerId, files);
      login(response?.result);
      setFiles({});
      toast.success('Documents uploaded successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
    } catch (error) {
      console.error('Upload Failed', error);
      toast.error('Failed to upload documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDocumentUploaded = (key: string) => !!user?.[key];
  const hasNewFile = (key: string) => !!files[key];
  const getExistingFileUrl = (key: string) => user?.[key] || null;

  return (
    <div className="w-full">
      <CardBox className="w-full">
        <div className="p-2">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Icon icon="solar:folder-with-files-bold-duotone" height={28} className="text-[#b03052]" />
                Document Center (Optional)
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload your business documents securely
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="text-right">
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                    style={{ width: `${(uploadedCount / documentTypes.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  {uploadedCount}/{documentTypes.length}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Documents uploaded</p>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <>
              {/* Document Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {documentTypes.map((doc) => {
                  const isUploaded = isDocumentUploaded(doc.key);
                  const hasFile = hasNewFile(doc.key);
                  const existingUrl = getExistingFileUrl(doc.key);

                  return (
                    <div
                      key={doc.key}
                      className={`relative rounded-xl border-2  pt-6 pb-3 transition-all duration-300 overflow-hidden ${isUploaded
                        ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10'
                        : hasFile
                          ? 'border-[#b03052] bg-[#b03052]/5'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                    >
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        {isUploaded ? (
                          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                            <Icon icon="solar:check-circle-bold" height={12} />
                            Uploaded
                          </span>
                        ) : hasFile ? (
                          <span className="flex items-center gap-1 px-2 py-1 bg-[#b03052] text-white text-xs font-medium rounded-full">
                            <Icon icon="solar:upload-bold" height={12} />
                            Ready
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                            <Icon icon="solar:clock-circle-bold" height={12} />
                            Pending
                          </span>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isUploaded || hasFile
                              ? `bg-gradient-to-br ${doc.color} shadow-lg`
                              : 'bg-gray-100 dark:bg-gray-700'
                              }`}
                          >
                            <Icon
                              icon={doc.icon}
                              height={24}
                              className={isUploaded || hasFile ? 'text-white' : 'text-gray-400'}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-800 dark:text-white truncate">
                              {doc.label}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {doc.description}
                            </p>
                          </div>
                        </div>

                        {/* Preview Area */}
                        {(hasFile || existingUrl) && (
                          <div className="mb-3 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            {hasFile ? (
                              // New file preview
                              <div className="relative">
                                {files[doc.key]?.type?.startsWith('image/') ? (
                                  <img
                                    src={URL.createObjectURL(files[doc.key])}
                                    alt="Preview"
                                    className="w-full h-24 object-cover"
                                  />
                                ) : files[doc.key]?.type === 'application/pdf' ? (
                                  <div className="h-24 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                                    <Icon icon="solar:document-bold" height={32} className="text-red-500" />
                                  </div>
                                ) : (
                                  <div className="h-24 flex items-center justify-center">
                                    <Icon icon="solar:file-bold" height={32} className="text-gray-400" />
                                  </div>
                                )}
                                <p className="text-xs text-gray-600 dark:text-gray-300 p-2 truncate">
                                  {files[doc.key]?.name}
                                </p>
                                {/* Remove button */}
                                <button
                                  onClick={() => handleRemoveFile(doc.key)}
                                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                  <Icon icon="solar:close-circle-bold" height={14} />
                                </button>
                              </div>
                            ) : existingUrl ? (
                              // Existing file preview
                              <div className="relative">
                                {/\.(jpg|jpeg|png|gif|webp)/i.test(existingUrl) ? (
                                  <img
                                    src={existingUrl}
                                    alt="Uploaded"
                                    className="w-full h-24 object-cover"
                                  />
                                ) : /\.pdf/i.test(existingUrl) ? (
                                  <div className="h-24 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                                    <Icon icon="solar:document-bold" height={32} className="text-red-500" />
                                  </div>
                                ) : (
                                  <div className="h-24 flex items-center justify-center">
                                    <Icon icon="solar:file-bold" height={32} className="text-emerald-500" />
                                  </div>
                                )}
                                <a
                                  href={existingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                                >
                                  <span className="text-white text-xs font-medium flex items-center gap-1">
                                    <Icon icon="solar:eye-bold" height={16} />
                                    View
                                  </span>
                                </a>
                              </div>
                            ) : null}
                          </div>
                        )}

                        {/* Upload Area */}
                        <input
                          ref={(el) => (fileInputRefs.current[doc.key] = el)}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(doc.key, e)}
                          className="hidden"
                        />

                        {!hasFile && (
                          <button
                            onClick={() => triggerFileInput(doc.key)}
                            className={`w-full py-3 rounded-lg border-2 border-dashed transition-all flex items-center justify-center gap-2 text-sm font-medium ${isUploaded
                              ? 'border-emerald-300 dark:border-emerald-700 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                              : 'border-gray-300 dark:border-gray-600 text-gray-500 hover:border-[#b03052] hover:text-[#b03052] hover:bg-[#b03052]/5'
                              }`}
                          >
                            <Icon icon={isUploaded ? 'solar:refresh-bold' : 'solar:upload-bold'} height={18} />
                            {isUploaded ? 'Replace Document' : 'Upload Document'}
                          </button>
                        )}

                        {hasFile && (
                          <button
                            onClick={() => triggerFileInput(doc.key)}
                            className="w-full py-2 text-xs text-gray-500 hover:text-[#b03052] transition-colors"
                          >
                            Choose different file
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upload Button */}
              {Object.keys(files).length > 0 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-[#b03052]">{Object.keys(files).length}</span> document(s) ready to upload
                  </p>
                  <button
                    onClick={handleUpload}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#b03052] to-[#8a2542] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#b03052]/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Icon icon="solar:cloud-upload-bold" height={20} />
                    Upload All Documents
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </CardBox>

      {/* Security Info */}
      <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
            <Icon icon="solar:shield-check-bold" className="text-emerald-600 dark:text-emerald-400" height={22} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">Your Documents Are Secure</h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              All documents are encrypted and stored securely. We never share your documents with third parties
              without your explicit consent.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="solar:lock-bold" className="text-emerald-600 dark:text-emerald-400" height={16} />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
