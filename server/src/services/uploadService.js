import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import fs from 'fs';

export const uploadFile = async (file, folder) => {
  try {
    const result = await uploadToCloudinary(file, folder);
    
    // Delete local file after upload
    fs.unlinkSync(file.path);
    
    return result;
  } catch (error) {
    // Delete local file if upload fails
    if (file.path) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};

export const deleteFile = async (publicId) => {
  try {
    await deleteFromCloudinary(publicId);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};
