import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image as ImageIcon } from 'lucide-react';

interface UploadCardProps {
  onFileAccepted: (file: File) => void;
  onError: (errorMsg: string) => void;
}

export const UploadCard: React.FC<UploadCardProps> = ({ onFileAccepted, onError }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    // Client-side file size validation (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      onError('File is too large. Maximum size allowed is 10 MB.');
      return;
    }

    onFileAccepted(file);
  }, [onFileAccepted, onError]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const getRejectionMessage = () => {
    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      if (error.code === 'file-invalid-type') {
        return 'Unsupported file format. Please upload a PDF or an Image (PNG, JPG, JPEG).';
      }
    }
    return null;
  };

  const rejectionMsg = getRejectionMessage();
  if (rejectionMsg) {
    onError(rejectionMsg);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all duration-300 text-center flex flex-col items-center justify-center shadow-sm
          ${isDragActive || dragActive
            ? 'border-indigo-600 bg-indigo-600/5 shadow-lg shadow-indigo-500/10 scale-[1.01]'
            : 'border-indigo-200 bg-white/70 hover:border-indigo-400 hover:bg-white hover:shadow-md'
          }`}
      >
        <input {...getInputProps()} />

        {/* Upload Icon Container with floating effect */}
        <div className={`p-3 rounded-full mb-3 bg-indigo-50 text-indigo-600 transition-transform duration-300 ${isDragActive ? 'scale-105' : 'group-hover:translate-y-[-2px]'}`}>
          <Upload className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-1">
          {isDragActive ? 'Drop your post here' : 'Analyze your social media copy'}
        </h3>
        <p className="text-xs text-slate-500 mb-4 max-w-xs leading-relaxed">
          Drag and drop a PDF file or an image (PNG, JPG, JPEG) to extract and analyze content
        </p>

        {/* Formats Container */}
        <div className="flex items-center space-x-4 text-[10px] text-slate-500 border-t border-indigo-50 pt-4 w-full justify-center">
          <div className="flex items-center space-x-1">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold">PDFs</span>
          </div>
          <div className="flex items-center space-x-1">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold">Images</span>
          </div>
        </div>

        {/* Size Badge */}
        <span className="absolute top-3 right-3 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
          Max 10MB
        </span>
      </div>
    </div>
  );
};
