import { outpost } from "./outpost";

const method = 'POST';
const url = 'https://api.resend.com/emails';
const headers = { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' };


export const sendConfirmationEmail = async (to, first_name, confirmation_link) => {
  const body = JSON.stringify({
    from: "Readen <noreply@docklabs.xyz>",
    to,
    subject: "Confirm Your Email",
    html: `
      <div style="font-family: 'Helvetica', Arial, sans-serif; max-width:600px; margin:auto; padding:20px; color:#333;">
        <h2 style="color:#111;">Hi ${first_name},</h2>
        <p style="line-height:1.6;">
          Please confirm your email by clicking the button below:
        </p>
        <p style="text-align:center; margin:30px 0;">
          <a href="${confirmation_link}" 
            style="background-color:#4F46E5; color:white; text-decoration:none; padding:12px 24px; border-radius:6px; display:inline-block; font-weight:bold;">
            Confirm Email
          </a>
        </p>
        <p style="line-height:1.6; font-size:14px; color:#555;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>
    `
    // html: `
    //   <p>Hi ${first_name},</p>
    //   <p>Thanks for signing up! Please confirm your email by clicking the link below:</p>
    //   <p><a href="${confirmation_link}">Confirm Email</a></p>
    //   <p>If you didn’t request this, just ignore this message.</p>
    // `,
  });

  const options = { method, headers, body}

  const response = await outpost(url, options);
  return response;
}

export const sendRecoveryEmail = async (to, recovery_link) => {
  const body = JSON.stringify({
    from: "Docklabs <noreply@docklabs.xyz>",
    to,
    subject: "Recover Your Email",
    html: `
      <p>Hi,</p>
      <p>We noticed you tried to recover your email, use this.</p>
      <p><a href="${recovery_link}">Confirm Email</a></p>
      <p>If you didn’t request this, just ignore this message.</p>
    `,
  });

  const options = { method, headers, body}

  const response = await outpost(url, options);
  return response;
}

export const sendLinkToApp = async (to, first_name, app_link) => {
  const body = JSON.stringify({
    from: "Docklabs <noreply@docklabs.xyz>",
    to,
    subject: "Here's Your Link!",
    html: `
      <p>Hi ${first_name},</p>
      <p>Email confirmation successful! We're sending you your specialized link</p>
      <p><a href="${app_link}">Link to Site</a></p>
      <p>If you didn’t request this, just ignore this message.</p>
    `,
  });

  const options = { method, headers, body}

  const response = await outpost(url, options);
  return response;
};
