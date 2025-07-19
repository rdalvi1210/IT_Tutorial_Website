const generateOtpEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="500" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
              <tr>
                <td align="center" style="padding-bottom: 20px;">
                  <h1 style="color: #333333; margin: 0;">KailvalyaInfotech</h1>
                  <p style="color: #6c757d; margin-top: 8px;">Secure Email Verification</p>
                </td>
              </tr>
              <tr>
                <td style="color: #444444; font-size: 16px; line-height: 1.6; padding-bottom: 30px;">
                  <p>Hello,</p>
                  <p>Thank you for signing up with <strong>KailvalyaInfotech</strong>!</p>
                  <p>Your One-Time Password (OTP) for email verification is:</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <div style="background-color: #007bff; color: #ffffff; font-size: 24px; padding: 12px 30px; border-radius: 8px; font-weight: bold; letter-spacing: 2px;">
                    ${otp}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="color: #666666; font-size: 14px; padding-top: 20px;">
                  <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
                  <p>If you did not request this, you can safely ignore this email.</p>
                  <p style="margin-top: 30px;">Regards,<br /><strong>KailvalyaInfotech Team</strong></p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top: 40px; font-size: 12px; color: #999999;">
                  © ${new Date().getFullYear()} KailvalyaInfotech. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

module.exports = generateOtpEmailTemplate;
