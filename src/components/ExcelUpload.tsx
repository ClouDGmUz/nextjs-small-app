import { useState } from 'react';

interface ExcelUploadProps {
  onUploadSuccess: (message: string) => void;
  onUploadError: (error: string) => void;
  onDataUpdate: () => void;
}

export default function ExcelUpload({ onUploadSuccess, onUploadError, onDataUpdate }: ExcelUploadProps) {
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/agents/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (response.ok) {
        if (result.requireConfirmation) {
          setPreviewData(result.preview);
          setShowPreview(true);
          setUploadError('');
          setUploadSuccess('');
        } else {
          setUploadSuccess(result.message);
          onUploadSuccess(result.message);
          setUploadError('');
          onDataUpdate();
        }
      } else {
        setUploadError(result.error || 'Failed to upload file');
        onUploadError(result.error || 'Failed to upload file');
        setUploadSuccess('');
      }
    } catch (error) {
      const errorMessage = 'Failed to upload file';
      setUploadError(errorMessage);
      onUploadError(errorMessage);
      setUploadSuccess('');
    }
  };

  const handleConfirmUpload = async () => {
    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append('file', fileInput.files[0]);
      formData.append('confirm', 'true');
      
      try {
        const response = await fetch('/api/agents/upload', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        
        if (response.ok) {
          setUploadSuccess(result.message);
          onUploadSuccess(result.message);
          setUploadError('');
          setShowPreview(false);
          setPreviewData([]);
          onDataUpdate();
        } else {
          setUploadError(result.error || 'Failed to upload file');
          onUploadError(result.error || 'Failed to upload file');
          setUploadSuccess('');
        }
      } catch {
        const errorMessage = 'Failed to upload file';
        setUploadError(errorMessage);
        onUploadError(errorMessage);
        setUploadSuccess('');
      }
    }
  };

  const handleCancelUpload = () => {
    setShowPreview(false);
    setPreviewData([]);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="mb-8 p-6 bg-primary-dark/90 dark:bg-primary-dark/95 backdrop-blur-sm rounded-lg shadow-xl border border-primary/20 dark:border-primary-light/20">
      <h2 className="text-xl font-semibold mb-4 text-white dark:text-secondary">Excel Fayldan Import</h2>
      
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light"
        />
      </div>

      {showPreview && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white mb-2">Ma'lumotlarni tasdiqlang</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-primary/20">
              <thead>
                <tr>
                  {Object.keys(previewData[0] || {}).map((header) => (
                    <th key={header} className="px-4 py-2 text-left text-sm font-medium text-secondary">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/20">
                {previewData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value: any, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 text-sm text-white">
                        {value?.toString() || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleConfirmUpload}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Tasdiqlash
            </button>
            <button
              onClick={handleCancelUpload}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}

      {uploadSuccess && (
        <div className="mt-4 p-3 bg-green-900/20 text-green-400 rounded-lg border border-green-800/50">
          {uploadSuccess}
        </div>
      )}

      {uploadError && (
        <div className="mt-4 p-3 bg-red-900/20 text-red-400 rounded-lg border border-red-800/50">
          {uploadError}
        </div>
      )}
    </div>
  );
}