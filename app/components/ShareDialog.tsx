import { useState } from 'react';
import { Link, Clock, Copy, X } from 'lucide-react';
import { apiService } from '../services/api';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
}

const ShareDialog = ({ isOpen, onClose, fileId, fileName }: ShareDialogProps) => {
  const [expiresIn, setExpiresIn] = useState<number>(24);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleShare = async () => {
    try {
      setLoading(true);
      const response = await apiService.createShareLink(Number(fileId), expiresIn);
      setShareUrl(`${window.location.origin}/share/${response.data.token}`);
    } catch (error) {
      console.error('Failed to generate share link:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Share File</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">Sharing: {fileName}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link expires in
          </label>
          <select
            value={expiresIn}
            onChange={(e) => setExpiresIn(Number(e.target.value))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value={24}>24 hours</option>
            <option value={72}>3 days</option>
            <option value={168}>7 days</option>
            <option value={720}>30 days</option>
            <option value={0}>No expiration</option>
          </select>
        </div>

        {shareUrl && (
          <div className="mb-4 p-2 bg-gray-50 rounded-md flex items-center justify-between">
            <span className="text-sm truncate mr-2">{shareUrl}</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-200 rounded"
              title="Copy link"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Link'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;