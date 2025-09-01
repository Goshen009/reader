import { outpost } from '../../src/utils/outpost';

const method = 'POST';
const url = 'https://api.resend.com/emails';
const headers = { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' };


export const sendConfirmationEmail = async (to, first_name, confirmation_link) => {
  const body = JSON.stringify({
    from: "Docklabs <noreply@docklabs.xyz>",
    to,
    subject: "Confirm Your Email",
    html: `
      <p>Hi ${first_name},</p>
      <p>Thanks for signing up! Please confirm your email by clicking the link below:</p>
      <p><a href="${confirmation_link}">Confirm Email</a></p>
      <p>If you didn’t request this, just ignore this message.</p>
    `,
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
