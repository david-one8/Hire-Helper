import React, { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import toast from 'react-hot-toast';

const ProfilePicture = ({ currentImage, onUpdate }) => {
  const [preview, setPreview] = useState(currentImage);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      await onUpdate?.(preview);
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error('Failed to update picture');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setPreview(null);
    try {
      await onUpdate?.(null);
      toast.success('Profile picture removed');
    } catch (error) {
      toast.error('Failed to remove picture');
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6">Profile Picture</h2>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <Avatar src={preview} size="2xl" fallback="U" />
          <label className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow-lg">
            <Camera size={16} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <label className="btn-outline cursor-pointer inline-flex items-center gap-2">
              <Upload size={18} />
              Change Photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {preview && (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleUpload}
                loading={loading}
              >
                Save Changes
              </Button>
              <Button size="sm" variant="ghost" onClick={handleRemove}>
                Remove
              </Button>
            </>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            JPG, PNG or GIF. Max size 5MB
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProfilePicture;
