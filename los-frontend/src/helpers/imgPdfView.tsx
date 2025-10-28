import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const FilePreview = ({ url }: { url: string }) => {
  const isPDF = url.toLowerCase().endsWith('.pdf');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-lg max-w-lg mx-auto">
      <div className="w-full h-64 flex justify-center items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
        {isPDF ? (
          <div>
            <img src="/pdf.png" alt="PDF" />
          </div>
        ) : (
          <img src={url} alt="Preview" className="max-h-full max-w-full object-contain" />
        )}
      </div>
      <Button onClick={handleDownload} className="flex items-center gap-2">
        <Download size={18} /> Download
      </Button>
    </div>
  );
};

export default FilePreview;
