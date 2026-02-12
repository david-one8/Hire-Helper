export const validateTaskForm = (formData) => {
  const errors = {};

  if (!formData.title || formData.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!formData.description || formData.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!formData.location || formData.location.trim().length < 3) {
    errors.location = 'Please provide a valid location';
  }

  if (!formData.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!formData.startTime) {
    errors.startTime = 'Start time is required';
  }

  if (formData.startDate && formData.endDate) {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) {
      errors.endDate = 'End date must be after start date';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRequestMessage = (message) => {
  if (!message || message.trim().length < 10) {
    return {
      isValid: false,
      error: 'Message must be at least 10 characters',
    };
  }

  if (message.length > 500) {
    return {
      isValid: false,
      error: 'Message must be less than 500 characters',
    };
  }

  return { isValid: true };
};

export const validateProfileForm = (formData) => {
  const errors = {};

  if (!formData.firstName || formData.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  if (!formData.lastName || formData.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (formData.phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Please provide a valid phone number';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '');
};
