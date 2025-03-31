```javascript
// src/utils/helpers.js

/**
 * Validates if the given string is a valid email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
const validateEmail = (email) => {
  if (typeof email !== 'string') {
    return false;
  }
  const sanitizedEmail = email.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitizedEmail);
};

/**
 * Validates if the given string is a valid password.
 * A valid password must be at least 8 characters long and contain
 * at least one uppercase letter, one lowercase letter, one number, and one special character.
 * @param {string} password - The password to validate.
 * @returns {boolean} - True if the password is valid, false otherwise.
 */
const validatePassword = (password) => {
  if (typeof password !== 'string') {
    return false;
  }

  if (password.length < 8) {
    return false;
  }

  if (!/[A-Z]/.test(password)) {
    return false;
  }

  if (!/[a-z]/.test(password)) {
    return false;
  }

  if (!/[0-9]/.test(password)) {
    return false;
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return false;
  }

  // Check for common password vulnerabilities (example: common passwords)
  const commonPasswords = ['password', '12345678', 'qwerty']; // Expand this list
  if (commonPasswords.includes(password.toLowerCase())) {
    return false;
  }

  return true;
};

/**
 * Formats a date object or string into "YYYY-MM-DD" format.
 * @param {Date|string} date - The date object or string to format.
 * @returns {string|null} - The formatted date string, or null if the input is invalid.
 */
const formatDate = (date) => {
  try {
    let dateObj;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return null;
    }

    if (isNaN(dateObj.getTime())) {
      return null;
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return null;
  }
};

/**
 * Calculates the Body Mass Index (BMI) given weight in kilograms and height in meters.
 * @param {number} weight - The weight in kilograms.
 * @param {number} height - The height in meters.
 * @returns {number|null} - The calculated BMI value, rounded to two decimal places, or null if the input is invalid.
 */
const calculateBMI = (weight, height) => {
  if (typeof weight !== 'number' || typeof height !== 'number') {
    return null;
  }

  if (weight <= 0 || height <= 0) {
    return null;
  }

  const bmi = weight / (height * height);
  return parseFloat(bmi.toFixed(2));
};

export { validateEmail, validatePassword, formatDate, calculateBMI };
```