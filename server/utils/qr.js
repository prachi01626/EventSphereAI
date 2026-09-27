const { authenticator } = require('otplib');
const QRCode = require('qrcode');

// Configure authenticator with standard 30-second window
authenticator.options = {
  step: 30,
  window: 1, // Allow 1-step window to handle minor network/clock latency
};

/**
 * Generate a new TOTP secret for registration
 */
const generateSecret = () => {
  return authenticator.generateSecret();
};

/**
 * Generate 30-Second Dynamic QR code as a Base64 image data URL
 * @param {string} registrationId
 * @param {string} totpSecret
 * @returns {Promise<{ qrCodeDataUrl: string, token: string, expiresIn: number }>}
 */
const generateDynamicQR = async (registrationId, totpSecret) => {
  if (!totpSecret) {
    throw new Error('TOTP secret is required to generate dynamic QR');
  }

  // Generate current 30s TOTP token
  const token = authenticator.generate(totpSecret);
  
  // Calculate remaining seconds in current 30s window
  const epoch = Math.floor(Date.now() / 1000);
  const timeRemaining = 30 - (epoch % 30);

  // Encoded payload inside the QR code
  const payload = JSON.stringify({
    registrationId,
    token,
    timestamp: Date.now(),
  });

  // Convert to high-quality SVG/PNG Base64 data URL
  const qrCodeDataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 320,
    color: {
      dark: '#1e1b4b',
      light: '#ffffff',
    },
  });

  return {
    qrCodeDataUrl,
    token,
    expiresIn: timeRemaining,
  };
};

/**
 * Verify TOTP Token for anti-proxy scan check
 * @param {string} token
 * @param {string} totpSecret
 * @returns {boolean}
 */
const verifyTOTPToken = (token, totpSecret) => {
  if (!token || !totpSecret) return false;
  try {
    return authenticator.check(token, totpSecret);
  } catch (error) {
    console.error('Error verifying TOTP token:', error);
    return false;
  }
};

module.exports = {
  generateSecret,
  generateDynamicQR,
  verifyTOTPToken,
};
