import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  firstName: yup
    .string()
    .optional()
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .optional()
    .min(2, 'Last name must be at least 2 characters'),
});

export const resetPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

export const updatePasswordSchema = yup.object({
  password: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const updateProfileSchema = yup.object({
  firstName: yup
    .string()
    .optional()
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .optional()
    .min(2, 'Last name must be at least 2 characters'),
  displayName: yup
    .string()
    .optional()
    .min(2, 'Display name must be at least 2 characters'),
  bio: yup
    .string()
    .optional()
    .max(500, 'Bio must be less than 500 characters'),
  phone: yup
    .string()
    .optional()
    .matches(
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid phone number'
    ),
  website: yup
    .string()
    .optional()
    .url('Please enter a valid website URL'),
});