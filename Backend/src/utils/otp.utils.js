export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function otpHTML(otp) {
    return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>CampusCart Verification</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background: #0b0b0b;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 50px 20px">
          <table
            width="500"
            cellpadding="0"
            cellspacing="0"
            style="
              background: #111111;
              border: 1px solid #222;
              border-radius: 16px;
              padding: 40px;
            "
          >
            <tr>
              <td align="center">
                <h1
                  style="
                    margin: 0;
                    font-size: 32px;
                    font-weight: 700;
                    color: #ffffff;
                  "
                >
                  Campus<span style="color: #ff4d6d">Cart</span>
                </h1>

                <p style="margin: 10px 0 35px; color: #888; font-size: 15px">
                  Verify your email to continue
                </p>

                <h2
                  style="
                    margin: 0;
                    color: #fff;
                    font-size: 22px;
                    font-weight: 600;
                  "
                >
                  Your Verification Code
                </h2>

                <p
                  style="
                    margin: 16px 0 30px;
                    color: #aaa;
                    font-size: 15px;
                    line-height: 24px;
                  "
                >
                  Enter the following OTP to verify your CampusCart account.
                </p>

                <div
                  style="
                    display: inline-block;
                    padding: 16px 32px;
                    background: #1a1a1a;
                    border: 1px solid #ff4d6d;
                    border-radius: 12px;
                    font-size: 34px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    color: #ff4d6d;
                  "
                >
                  ${otp}
                </div>

                <p
                  style="
                    margin-top: 30px;
                    color: #888;
                    font-size: 14px;
                    line-height: 22px;
                  "
                >
                  This code expires in
                  <strong style="color: #fff">5 minutes</strong>.
                </p>

                <p
                  style="
                    margin-top: 10px;
                    color: #666;
                    font-size: 13px;
                    line-height: 22px;
                  "
                >
                  If you didn't request this email, you can safely ignore it.
                </p>

                <hr
                  style="
                    margin: 35px 0 20px;
                    border: none;
                    border-top: 1px solid #222;
                  "
                />

                <p style="margin: 0; color: #555; font-size: 12px">
                  © 2026 CampusCart • Made for Students
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

}