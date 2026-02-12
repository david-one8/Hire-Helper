import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success('Email verified successfully!');
      navigate('/feed');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('OTP resent to your email');
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="max-w-md mx-auto">
        <button
          onClick={() => navigate('/auth/login')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
        >
          <ArrowLeft size={20} />
          Back to login
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-white" size={28} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter the 6-digit code sent to your email
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            For demo: any 6-digit number works
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-semibold bg-white dark:bg-dark-700 border-2 border-gray-300 dark:border-dark-600 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none transition-all"
            />
          ))}
        </div>

        <Button
          fullWidth
          onClick={handleVerify}
          loading={loading}
          className="mb-4"
        >
          Verify Code
        </Button>

        <div className="text-center">
          <button
            onClick={handleResend}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default VerifyEmail;
