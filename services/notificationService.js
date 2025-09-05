// Stub for push/email/SMS fanout; currently only email service is implemented.
export const notify = async (user, subject, messageHtml) => {
  // In real life, choose channel by user prefs.
  return { queued: true };
};
