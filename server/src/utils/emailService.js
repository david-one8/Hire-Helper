import { Resend } from 'resend';

// Initialize Resend (will be null if not configured)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Email templates
const emailTemplates = {
  requestReceived: (taskTitle, requesterName) => ({
    subject: `New Help Request for "${taskTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Help Request!</h2>
        <p>Hi there,</p>
        <p><strong>${requesterName}</strong> has requested to help with your task "<strong>${taskTitle}</strong>".</p>
        <p>Log in to your HireHelper account to view the request and respond.</p>
        <a href="${process.env.FRONTEND_URL}/requests" 
           style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          View Request
        </a>
        <p>Best regards,<br>HireHelper Team</p>
      </div>
    `,
  }),

  requestAccepted: (taskTitle, ownerName) => ({
    subject: `Your Request was Accepted!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Request Accepted! 🎉</h2>
        <p>Great news!</p>
        <p><strong>${ownerName}</strong> has accepted your request to help with "<strong>${taskTitle}</strong>".</p>
        <p>You can now coordinate with the task owner to complete the task.</p>
        <a href="${process.env.FRONTEND_URL}/my-requests" 
           style="display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          View Task Details
        </a>
        <p>Best regards,<br>HireHelper Team</p>
      </div>
    `,
  }),

  requestRejected: (taskTitle) => ({
    subject: `Update on Your Help Request`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Request Update</h2>
        <p>Hi there,</p>
        <p>Unfortunately, your request to help with "<strong>${taskTitle}</strong>" was not accepted this time.</p>
        <p>Don't worry! There are many other tasks available that might be a better fit.</p>
        <a href="${process.env.FRONTEND_URL}/feed" 
           style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Browse More Tasks
        </a>
        <p>Best regards,<br>HireHelper Team</p>
      </div>
    `,
  }),

  taskCompleted: (taskTitle, helperName) => ({
    subject: `Task Completed: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Task Completed! ✅</h2>
        <p>Great news!</p>
        <p>Your task "<strong>${taskTitle}</strong>" has been marked as completed by <strong>${helperName}</strong>.</p>
        <p>Please take a moment to rate your experience and leave a review.</p>
        <a href="${process.env.FRONTEND_URL}/my-tasks" 
           style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Rate & Review
        </a>
        <p>Best regards,<br>HireHelper Team</p>
      </div>
    `,
  }),
};

// Send email function using Resend
export const sendEmail = async (to, templateName, data) => {
  // Skip if Resend is not configured
  if (!resend) {
    console.log(`📧 Resend not configured - skipping email to: ${to}`);
    return;
  }

  try {
    const template = emailTemplates[templateName](...Object.values(data));

    const { data: response, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'HireHelper <onboarding@resend.dev>',
      to,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error(`❌ Error sending email: ${error.message}`);
      return;
    }

    console.log(`✅ Email sent to ${to} - ID: ${response.id}`);
  } catch (error) {
    console.error(`❌ Error sending email: ${error.message}`);
    // Don't throw error - just log it so app continues working
  }
};

export default emailTemplates;
