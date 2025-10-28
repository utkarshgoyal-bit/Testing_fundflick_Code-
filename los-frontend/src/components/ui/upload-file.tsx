import { Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { InputProps } from './input';

export default function UploadFileBox({
  errors,
  onFileChange,
  ...props
}: InputProps & { errors?: string; onFileChange: (file: File) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (inputRef.current) {
        inputRef.current.files = e.dataTransfer.files;
        onFileChange(e.dataTransfer.files[0]);
      }
    }
  };
  useEffect(() => {
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('change', (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files[0]) {
          onFileChange(files[0]);
        }
      });
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('change', () => {});
      }
    };
  }, [onFileChange]);
  return (
    <div
      className={`border-2  w-full rounded-xl p-8 text-center text-sm transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-indigo-50 ${
        dragActive ? 'border-indigo-500 bg-indigo-100' : 'border-dashed border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <div className="flex justify-center mb-4">
        <Upload />
      </div>

      <p className="text-sm text-gray-700">
        <span className="text-primary ">Click here</span> to upload your file or drag and drop.
      </p>
      <p className="text-xs text-secondary mt-1">{props.accept}</p>

      {inputRef.current?.files && inputRef.current?.files?.length > 0 && (
        <p className="mt-3 text-sm text-primary font-semibold">
          <span>Selected File:</span> <span>{inputRef?.current?.files[0]?.name}</span>
        </p>
      )}
      {errors && <p className="mt-2 text-sm text-red-500">{errors}</p>}
      <input ref={inputRef} type="file" id="fileUploadInput" accept=".csv, .xls, .xlsx" className="hidden" {...props} />
    </div>
  );
}
