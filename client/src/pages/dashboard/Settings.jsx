import React, { useState, useRef } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Camera, Save } from 'lucide-react';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import toast from 'react-hot-toast';
import api from '@services/api';

const Settings = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: user?.primaryPhoneNumber?.phoneNumber || '',
    bio: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      await api.updateProfile(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phone,
          bio: formData.bio,
        },
        token
      );
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const token = await getToken();
      const photoFormData = new FormData();
      photoFormData.append('profilePicture', file);
      await api.uploadProfilePicture(photoFormData, token);
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error(error.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your profile and account preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <Card>
          <h2 className="text-xl font-semibold mb-6">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={user?.imageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                loading={uploadingPhoto}
              >
                Change Photo
              </Button>
              <Button size="sm" variant="ghost" className="ml-2">
                Remove
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                JPG, PNG or GIF. Max size 5MB
              </p>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card>
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio (Optional)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Experienced handyman and problem solver. Available for various tasks..."
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
              />
            </div>

            <Button type="submit" icon={<Save size={20} />} loading={loading}>
              Save Changes
            </Button>
          </form>
        </Card>

        {/* Account Security */}
        <Card>
          <h2 className="text-xl font-semibold mb-6">Account Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-dark-700">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated 3 months ago
                </p>
              </div>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add an extra layer of security
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
