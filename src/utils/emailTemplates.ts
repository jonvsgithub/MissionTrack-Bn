export const organizationRegistrationTemplate = (name: string) => ({
  subject: 'MissionTrack - Organization Registration Received',
  html: `<p>Hello ${name},</p>
  <p>We have received your registration request. Our administrators will review and get back to you soon.</p>
  <p>Thank you,<br/>MissionTrack Team</p>`
});

export const missionStatusTemplate = (recipient: string, missionPurpose: string, status: string) => ({
  subject: `Mission ${status}`,
  html: `<p>Hello ${recipient},</p>
  <p>Your mission request for <strong>${missionPurpose}</strong> is now <strong>${status}</strong>.</p>
  <p>Regards,<br/>MissionTrack</p>`
});



