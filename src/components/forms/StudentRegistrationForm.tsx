import React, { useState, useCallback } from 'react';
import { signUpStudent } from '../../lib/auth';
import { AuthError } from '@supabase/supabase-js';

interface StudentRegistrationFormProps {
  onSuccess?: () => void;
}

export const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log('Form is already submitting, please wait...');
      return;
    }

    setError(null);
    setLoading(true);
    setSuccess(false);
    setIsSubmitting(true);

    if (!validateForm()) {
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    console.log('Form submission started:', { email, fullName });

    try {
      const { success, error, data } = await signUpStudent(email, password, fullName);
      
      console.log('Signup response:', { success, error, data });

      if (error) {
        console.error('Signup error:', error);
        setError(error.message || 'An error occurred during registration');
        return;
      }

      if (success) {
        console.log('Registration successful, clearing form');
        setSuccess(true);
        // Clear form
        setFullName('');
        setEmail('');
        setPassword('');
        onSuccess?.();
      } else {
        console.error('Registration failed without error');
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  }, [email, password, fullName, isSubmitting, onSuccess]);

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border rounded"
          required
          minLength={2}
          autoComplete="name"
          disabled={isSubmitting}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          title="Please enter a valid email address"
          autoComplete="email"
          disabled={isSubmitting}
          placeholder="example@domain.com"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
          minLength={6}
          autoComplete="new-password"
          disabled={isSubmitting}
        />
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          Registration successful! Please check your email to verify your account.
        </div>
      )}
      <button
        type="submit"
        disabled={loading || isSubmitting}
        className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 disabled:bg-orange-300"
      >
        {loading ? 'Registering...' : 'Register as Student'}
      </button>
    </form>
  );
}; 