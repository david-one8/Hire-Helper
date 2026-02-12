import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Input from '@components/common/Input';
import Button from '@components/common/Button';

const TaskForm = ({ onSubmit, initialData = {}, loading = false }) => {
  const [imagePreview, setImagePreview] = useState(initialData.image || null);
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    location: initialData.location || '',
    startDate: initialData.startDate || '',
    startTime: initialData.startTime || '',
    endDate: initialData.endDate || '',
    endTime: initialData.endTime || '',
    category: initialData.category || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, image: imagePreview });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Task Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g., Help moving furniture"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Describe what help you need..."
          className="w-full px-4 py-2.5 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
          required
        />
      </div>

      <Input
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="e.g., Downtown Seattle, WA"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Start Date"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
        <Input
          label="Start Time"
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="End Date (Optional)"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
        <Input
          label="End Time (Optional)"
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="">Select a category</option>
          <option value="moving">Moving & Transportation</option>
          <option value="cleaning">Cleaning & Maintenance</option>
          <option value="tech">Tech & Computer Help</option>
          <option value="gardening">Gardening & Outdoor</option>
          <option value="painting">Painting & Decoration</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Task Image (Optional)
        </label>
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
            <Upload className="text-gray-400 mb-2" size={32} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Upload a file or drag and drop
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>

      <Button type="submit" fullWidth loading={loading}>
        {initialData.id ? 'Update Task' : 'Post Task'}
      </Button>
    </form>
  );
};

export default TaskForm;
