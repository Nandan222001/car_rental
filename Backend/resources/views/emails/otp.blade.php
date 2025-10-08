<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your One-Time Password</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        /* Reset styles */
        body { margin: 0; padding: 0; }
        /* Custom styles */
        .container {
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
        }
        .header {
            background-color: #004d99; /* Dark Blue Header */
            padding: 20px 0;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            font-size: 28px;
            margin: 0;
        }
        .content {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            border: 1px solid #dddddd;
            border-top: none;
        }
        .otp-box {
            background-color: #e6f7ff; /* Light blue background for OTP */
            border: 1px solid #3399cc;
            border-radius: 8px;
            padding: 15px 20px;
            text-align: center;
            margin: 25px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #004d99;
            letter-spacing: 5px; /* Spacing for emphasis */
            margin: 0;
            display: block; /* Ensure it takes full width */
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <center>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="max-width: 600px; margin: 0 auto;">
                        <tr>
                            <td class="header">
                                <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Drive India 🚗</h1>
                            </td>
                        </tr>

                        <tr>
                            <td class="content">
                                <h2 style="color: #333333; font-size: 22px; margin-top: 0; margin-bottom: 20px;">Payment Verification Required</h2>

                                <p style="font-size: 16px; color: #555555; line-height: 1.6;">
                                    Hello,
                                </p>
                                <p style="font-size: 16px; color: #555555; line-height: 1.6;">
                                    You have requested to complete a payment. Please use the following **One-Time Password (OTP)** to authorize the transaction:
                                </p>

                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center" style="padding: 25px 0;">
                                            <div class="otp-box">
                                                <p style="font-size: 14px; color: #555555; margin-bottom: 10px;">Your OTP Code</p>
                                                <span class="otp-code">{{ $otp }}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                <p style="font-size: 16px; color: #cc0000; font-weight: bold; line-height: 1.6;">
                                    ⚠️ Important: This code is only valid for **10 minutes** and is for single use.
                                </p>

                                <p style="font-size: 16px; color: #555555; line-height: 1.6;">
                                    If you did not request this OTP, please disregard this email and ensure your account is secure.
                                </p>
                                
                                <p style="font-size: 16px; color: #555555; line-height: 1.6;">
                                    Thank you,<br>
                                    **The Drive India Team**
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td class="footer">
                                <p style="margin: 0;">&copy; {{ date('Y') }} Drive India. All rights reserved.</p>
                                <p style="margin: 5px 0 0;">Do not reply to this automated email.</p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>