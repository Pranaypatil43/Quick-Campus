const { BrevoClient } = require("@getbrevo/brevo");

const getClient = () => new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

const sendEmail = async (to, toName, subject, html) => {
  try {
    const client = getClient();
    const result = await client.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME || "University ERP",
      },
      to: [{ email: to, name: toName || to }],
      subject,
      htmlContent: html,
    });
    console.log(`✅ Email sent to ${to}`, result?.messageId || "");
    return true;
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, JSON.stringify(err?.response?.body || err.message));
    return false;
  }
};

const approvalEmailHtml = (name, email, password, role) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:32px;border-radius:12px;">
    <div style="background:#003566;padding:24px;border-radius:8px;text-align:center;margin-bottom:24px;">
      <h1 style="color:#ffc300;margin:0;font-size:24px;">University ERP</h1>
      <p style="color:#d9d9d9;margin:8px 0 0;">Admission Approved</p>
    </div>
    <h2 style="color:#003566;">Dear ${name},</h2>
    <p style="color:#555;line-height:1.8;">
      Congratulations! Your admission has been <b style="color:#16a34a;">approved</b>.<br/>
      Your login credentials for the University ERP portal are:
    </p>
    <div style="background:#fff;border:2px solid #003566;border-radius:8px;padding:20px;margin:20px 0;">
      <p style="margin:0 0 10px;font-size:15px;"><b>Role:</b> ${role}</p>
      <p style="margin:0 0 10px;font-size:15px;"><b>Login Email:</b> <span style="color:#003566;">${email}</span></p>
      <p style="margin:0;font-size:15px;"><b>Password:</b> <span style="color:#003566;">${password}</span></p>
    </div>
    <p style="color:#555;">Login at <a href="http://localhost:5173" style="color:#003566;font-weight:bold;">University ERP Portal</a></p>
    <p style="color:#999;font-size:12px;margin-top:24px;">This is an automated message. Please do not reply.</p>
  </div>
`;

const parentEmailHtml = (studentName, parentName, role) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:32px;border-radius:12px;">
    <div style="background:#003566;padding:24px;border-radius:8px;text-align:center;margin-bottom:24px;">
      <h1 style="color:#ffc300;margin:0;font-size:24px;">University ERP</h1>
      <p style="color:#d9d9d9;margin:8px 0 0;">Admission Confirmation</p>
    </div>
    <h2 style="color:#003566;">Dear ${parentName || "Parent/Guardian"},</h2>
    <p style="color:#555;line-height:1.8;">
      We are pleased to inform you that <b>${studentName}</b>'s admission as <b>${role}</b>
      has been <b style="color:#16a34a;">approved</b> by University ERP.
    </p>
    <p style="color:#555;line-height:1.8;">
      Login credentials have been sent to the student's registered email address.
      They can now access the portal to view fees, attendance, results and more.
    </p>
    <p style="color:#999;font-size:12px;margin-top:24px;">This is an automated message. Please do not reply.</p>
  </div>
`;

const getWhatsAppLink = (phone, studentName, email, password) => {
  const msg = encodeURIComponent(
    `University ERP - Admission Approved\n\nDear ${studentName},\n\nYour admission has been approved!\n\nLogin Credentials:\nEmail: ${email}\nPassword: ${password}\n\nLogin at: http://localhost:5173`
  );
  const cleaned = phone.replace(/\D/g, "");
  const withCode = cleaned.startsWith("91") ? cleaned : `91${cleaned}`;
  return `https://wa.me/${withCode}?text=${msg}`;
};

module.exports = { sendEmail, approvalEmailHtml, parentEmailHtml, getWhatsAppLink };
