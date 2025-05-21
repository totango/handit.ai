// services/emailService.js
import sgMail from '@sendgrid/mail';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import dotenv from 'dotenv';
import { Op } from 'sequelize';

dotenv.config();

const __dirname = path.resolve();
// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Renders an HTML template with provided data.
 * @param {string} templateName - Name of the template file (without extension).
 * @param {Object} data - Data to inject into the template.
 * @returns {string} - Rendered HTML.
 */
const renderTemplate = (templateName, data) => {
  const filePath = path.join(__dirname, 'src', 'services', 'templates', `${templateName}.hbs`);
  const source = fs.readFileSync(filePath, 'utf8');
  const template = handlebars.compile(source);
  return template(data);
};

/**
 * Sends an email.
 * @param {Object} options - Email options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Email subject.
 * @param {string} options.text - Plain text body.
 * @param {string} [options.html] - HTML body.
 * @param {Array} [options.attachments] - Array of attachment objects.
 * @param {string} [options.notificationSource] - Source of the notification (e.g., agent_node, model_log).
 * @param {number} [options.sourceId] - ID of the source (e.g., agent_node_id, model_log_id).
 * @returns {Promise<void>}
 */
export const sendEmail = async ({ to, subject, text, html, attachments, Email, User, notificationSource, sourceId }) => {
  // If this is a notification email, check rate limiting
  if (notificationSource && sourceId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count notifications from the same source today
    const todayNotifications = await Email.count({
      where: {
        notificationSource,
        sourceId,
        createdAt: {
          [Op.gte]: today
        }
      }
    });

    // If we've already sent 2 notifications from this source today, skip
    if (todayNotifications >= 2) {
      console.log(`Rate limit reached for notifications from source ${notificationSource} with ID ${sourceId}`);
      return;
    }
  }

  const msg = {
    to,
    from: {
      email: process.env.EMAIL_FROM, // contact@handit.ai
      name: "Handit.AI"
    },
    subject,
    text,
    html,
    attachments,
  };
  
  try {
    await sgMail.send(msg);

    // Save email to database
    await Email.create({
      to: to instanceof Array ? to.join(',') : to,
      from: process.env.EMAIL_FROM,
      subject,
      body: text,
      html,
      attachments: JSON.stringify(attachments),
      status: 'sent',
      sentAt: new Date(),
      notificationSource,
      sourceId
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    if (error.response) {
      console.error(error.response.body);
    }
    await Email.create({
      to,
      from: process.env.EMAIL_FROM,
      subject,
      body: text,
      html,
      attachments: JSON.stringify(attachments),
      status: 'failed',
      notificationSource,
      sourceId
    });
    throw error;
  }
};

/**
 * Sends a bulk email.
 * @param {Object} options - Bulk email options.
 * @param {Array<string>} options.recipients - Array of recipient email addresses.
 * @param {string} options.subject - Email subject.
 * @param {string} options.text - Plain text body.
 * @param {string} [options.html] - HTML body.
 * @returns {Promise<void>}
 */
export const sendBulkEmail = async ({ recipients, subject, text, html }) => {
  const msg = {
    to: ['gfcristhian98@gmail.com'],
    from: {
      email: process.env.EMAIL_FROM, // contact@handit.ai
      name: "Handit.AI"
    },
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Bulk email sent to ${recipients.length} recipients`);
  } catch (error) {
    console.error('Error sending bulk email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};

/**
 * Sends a templated email.
 * @param {Object} options - Email options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Email subject.
 * @param {Object} options.templateData - Data for the template.
 * @param {string} options.templateName - Name of the template file (without extension).
 * @param {Array} [options.attachments] - Array of attachment objects.
 * @returns {Promise<void>}
 */
export const sendTemplatedEmail = async ({ to, subject, templateName, templateData, attachments, Email, User, notificationSource, sourceId }) => {
  const html = renderTemplate(templateName, templateData);

  await sendEmail({
    to,
    subject,
    text: 'This is a fallback text version of the email.',
    html,
    attachments,
    Email,
    User,
    notificationSource,
    sourceId
  });
};

export const sendTemplatedBulkEmail = async ({ recipients, subject, templateName, templateData }) => {
  const html = renderTemplate(templateName, templateData);

  await sendBulkEmail({
    recipients,
    subject,
    text: 'This is a fallback text version of the email.',
    html,
  });
}

/**
 * Sends a model evaluation failure email to a single recipient.
 * @param {Object} options - Email options.
 * @param {string} options.recipientName - Name of the recipient.
 * @param {string} options.recipientEmail - Email address of the recipient.
 * @param {string} options.agentName - Name of the agent.
 * @param {string} options.nodeName - Name of the node.
 * @param {string} options.inputPayload - Input payload for the model.
 * @param {string} options.outputPayload - Output payload from the model.
 * @param {string} options.reviewerSummary - Summary provided by the automatic evaluator.
 * @param {number} options.agentId - ID of the agent.
 * @param {number} options.agentLogId - ID of the agent log.
 * @returns {Promise<void>}
 */
export const sendModelReviewFailureEmail = async ({
  recipientName,
  recipientEmail,
  agentName,
  nodeName,
  inputPayload,
  outputPayload,
  reviewerSummary,
  agentId,
  agentLogId,
  Email,
  User,
  notificationSource,
  sourceId
}) => {
  const subject = '🚨 Handit Alert: Automatic Evaluation Issue Detected';
  const tracingUrl = `https://dashboard.handit.ai/ag-tracing?agentId=${agentId}&entryLog=${agentLogId}`;
  
  const templateData = {
    recipient_name: recipientName,
    agent_name: agentName,
    node_name: nodeName,
    timestamp: new Date().toLocaleString(),
    input_payload: inputPayload,
    output_payload: outputPayload,
    reviewer_summary: reviewerSummary,
    tracing_url: tracingUrl,
    year: new Date().getFullYear()
  };

  await sendTemplatedEmail({
    to: 'gfcristhian98@gmail.com',
    subject,
    templateName: 'modelReviewFailureTemplate',
    templateData,
    Email,
    attachments: [
      {
        content: fs.readFileSync(path.join(__dirname, 'src/services/templates/logo.png')).toString('base64'),
        filename: 'logo.png',
        type: 'image/png',
        disposition: 'inline',
        content_id: 'logo-image'
      },
      {
        content: fs.readFileSync(path.join(__dirname, 'src/services/templates/bg-real.png')).toString('base64'),
        filename: 'bg-handit.png',
        type: 'image/png',
        disposition: 'inline',
        content_id: 'bg-image'
      }
    ],
    User,
    notificationSource,
    sourceId
  });
};

/**
 * Sends model evaluation failure emails to all users of a company.
 * @param {Object} options - Email options.
 * @param {number} options.companyId - ID of the company.
 * @param {string} options.agentName - Name of the agent.
 * @param {string} options.nodeName - Name of the node.
 * @param {string} options.inputPayload - Input payload for the model.
 * @param {string} options.outputPayload - Output payload from the model.
 * @param {string} options.reviewerSummary - Summary provided by the automatic evaluator.
 * @param {number} options.agentId - ID of the agent.
 * @param {number} options.agentLogId - ID of the agent log.
 * @param {string} [options.notificationSource] - Source of the notification.
 * @param {number} [options.sourceId] - ID of the source.
 * @returns {Promise<void>}
 */
export const sendModelReviewFailureEmailsToCompany = async ({
  companyId,
  agentName,
  nodeName,
  inputPayload,
  outputPayload,
  reviewerSummary,
  agentId,
  agentLogId,
  Email,
  User,
  notificationSource,
  sourceId
}) => {
  // Get all users from the company
  const users = await User.findAll({
    where: {
      companyId: companyId
    }
  });

  // Send emails to each user
  for (const user of users) {
    await sendModelReviewFailureEmail({
      recipientName: `${user.firstName} ${user.lastName}`,
      recipientEmail: user.email,
      agentName,
      nodeName,
      inputPayload,
      outputPayload,
      reviewerSummary,
      agentId,
      agentLogId,
      Email,
      User,
      notificationSource,
      sourceId
    });
  }
};

/**
 * Sends a model failure notification email when a model log is updated and marked as failed.
 * @param {Object} modelLog - The model log that was updated.
 * @returns {Promise<void>}
 */
export const sendModelFailureNotification = async (modelLog, Model, AgentLog, Agent, AgentNode, Company, Email, User) => {
  try {
    // Get the model
    const model = await Model.findByPk(modelLog.modelId);
    if (!model) {
      console.error(`Model not found for modelLog ID: ${modelLog.id}`);
      return;
    }

    // Get the agent log
    const agentLog = await AgentLog.findByPk(modelLog.agentLogId);
    if (!agentLog) {
      console.error(`Agent log not found for modelLog ID: ${modelLog.id}`);
      return;
    }

    // Get the agent
    const agent = await Agent.findByPk(agentLog.agentId);
    if (!agent) {
      console.error(`Agent not found for agentLog ID: ${agentLog.id}`);
      return;
    }

    // Get the agent node
    const agentNode = await AgentNode.findOne({
      where: {
        agentId: agent.id,
        modelId: model.id
      }
    });
    if (!agentNode) {
      console.error(`Agent node not found for agent ID: ${agent.id} and model ID: ${model.id}`);
      return;
    }

    // Get the company
    const company = await Company.findByPk(agent.companyId);
    if (!company) {
      console.error(`Company not found for agent ID: ${agent.id}`);
      return;
    }

    // Prepare the reviewer summary
    let reviewerSummary = "The model evaluation failed.";
    if (modelLog.actual && modelLog.actual.summary) {
      reviewerSummary = modelLog.actual.summary;
    } else if (modelLog.actual && modelLog.actual.reviewerSummary) {
      reviewerSummary = modelLog.actual.reviewerSummary;
    }

    // Send the email to all users of the company
    await sendModelReviewFailureEmailsToCompany({
      companyId: company.id,
      agentName: agent.name,
      nodeName: agentNode.name,
      inputPayload: JSON.stringify(modelLog.input),
      outputPayload: JSON.stringify(modelLog.output),
      reviewerSummary,
      agentId: agent.id,
      agentLogId: agentLog.id,
      Email,
      User,
      notificationSource: 'model_log',
      sourceId: modelLog.id
    });

    console.log(`Model failure notification sent for modelLog ID: ${modelLog.id}`);
  } catch (error) {
    console.error(`Error sending model failure notification for modelLog ID: ${modelLog.id}:`, error);
  }
};

/**
 * Sends a tool error notification email when an agent node log has an error.
 * @param {Object} agentNodeLog - The agent node log that contains the error.
 * @returns {Promise<void>}
 */
export const sendToolErrorNotification = async (agentNodeLog, Agent, AgentNode, Company, Email, User) => {
  try {
    // Get the agent and agent node
    const agent = await Agent.findByPk(agentNodeLog.agentId);
    const agentNode = await AgentNode.findByPk(agentNodeLog.agentNodeId);
    const company = await Company.findByPk(agent.companyId);

    if (!agent || !agentNode || !company) {
      console.error('Could not find agent, agent node, or company for tool error notification');
      return;
    }

    // Get all users in the company
    const users = await User.findAll({
      where: { companyId: company.id }
    });

    // Construct the tracing URL
    const tracingUrl = `${process.env.DASHBOARD_URL}/agents/${agent.id}/logs/${agentNodeLog.parentLogId}`;

    // Extract error details from output.error and output.stack
    const errorMessage = agentNodeLog.output?.error || 'Unknown error';
    const errorStack = agentNodeLog.output?.stack;

    // Send email to each user
    for (const user of users) {
      await sendTemplatedEmail({
        to: 'gfcristhian98@gmail.com',
        subject: `[Handit.AI] Tool Error Alert - ${agent.name}`,
        templateName: 'toolErrorTemplate',
        templateData: {
          recipientName: user.name,
          agent_name: agent.name,
          node_name: agentNode.name,
          timestamp: new Date(agentNodeLog.createdAt).toLocaleString(),
          operation_type: agentNodeLog.operationType || 'tool_operation',
          error_message: errorMessage,
          error_stack: errorStack,
          tracing_url: tracingUrl,
          year: new Date().getFullYear()
        },
        Email,
        User,
        notificationSource: 'agent_node',
        sourceId: agentNodeLog.id
      });
    }
  } catch (error) {
    console.error('Error sending tool error notification:', error);
  }
};

export const sendWeeklyPerformanceEmail = async ({
  companyId,
  startDate,
  endDate,
  header,
  agents,
  Email,
  User,
  clientName,
  tracingUrl,
  notificationSource = 'weekly_performance',
  sourceId = null
}) => {
  try {
    // Get company users who should receive the email
    const users = await User.findAll({
      where: {
        companyId: companyId,
      }
    });

    if (users.length === 0) {
      console.log(`No users found with active messages for company ${companyId} to receive weekly performance email`);
      return;
    }

    // Format dates
    const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Prepare template data
    const templateData = {
      client_name: clientName || 'Valued Client',
      agents: agents,
      tracing_url: tracingUrl || `https://dashboard.handit.ai/ag-monitoring`,
      year: new Date().getFullYear(),
      header,
    };

    // Send email to each user
    await sendTemplatedEmail({
      to: users.map(user => user.email),
      subject: `Handit.AI Weekly Performance Report (${formattedStartDate} - ${formattedEndDate})`,
      templateName: 'weeklyPerformanceTemplate',
      templateData,
      attachments: [
        {
          content: fs.readFileSync(path.join(__dirname, 'src/services/templates/logo.png')).toString('base64'),
          filename: 'logo.png',
          type: 'image/png',
          disposition: 'inline',
          content_id: 'logo-image'
        },
        {
          content: fs.readFileSync(path.join(__dirname, 'src/services/templates/bg-real.png')).toString('base64'),
          filename: 'bg-handit.png',
          type: 'image/png',
          disposition: 'inline',
          content_id: 'bg-image'
        }
      ],
      Email,
      User,
      notificationSource,
      sourceId
    });
  
    console.log(`Weekly performance email sent to ${users.length} users for company ${companyId}`);
  } catch (error) {
    console.error(`Error sending weekly performance email for company ${companyId}:`, error);
  }
};

export const sendAutonomWaitlistEmail = async ({
  recipientEmail,
  firstName,
  Email,
  User,
  notificationSource = 'autonom_waitlist',
  sourceId = null
}) => {
  const subject = '🚀 Welcome to the Autonom Waitlist!';
  
  const templateData = {
    first_name: firstName,
    year: new Date().getFullYear()
  };

  await sendTemplatedEmail({
    to: recipientEmail,
    subject,
    templateName: 'autonomWaitlistTemplate',
    templateData,
    attachments: [
      {
        content: fs.readFileSync(path.join(__dirname, 'src/services/templates/logo.png')).toString('base64'),
        filename: 'logo.png',
        type: 'image/png',
        disposition: 'inline',
        content_id: 'logo-image'
      },
      {
        content: fs.readFileSync(path.join(__dirname, 'src/services/templates/bg-real.png')).toString('base64'),
        filename: 'bg-handit.png',
        type: 'image/png',
        disposition: 'inline',
        content_id: 'bg-image'
      }
    ],
    Email,
    User,
    notificationSource,
    sourceId
  });
};

export const sendWelcomeNewUserEmail = async ({
  recipientEmail,
  firstName,
  password,
  Email,
  User,
  notificationSource = 'welcome_new_user',
  sourceId = null
}) => {
  const subject = '🎉 Welcome to Handit.ai!';
  
  const templateData = {
    first_name: firstName,
    email: recipientEmail,
    password: password,
    year: new Date().getFullYear()
  };

  await sendTemplatedEmail({
    to: recipientEmail,
    subject,
    templateName: 'welcomeNewUserTemplate',
    templateData,
    attachments: [
      {
        content: fs.readFileSync(path.join(__dirname, 'src/services/templates/logo.png')).toString('base64'),
        filename: 'logo.png',
        type: 'image/png',
        disposition: 'inline',
        content_id: 'logo-image'
      },
      {
        content: fs.readFileSync(path.join(__dirname, 'src/services/templates/bg-real.png')).toString('base64'),
        filename: 'bg-handit.png',
        type: 'image/png',
        disposition: 'inline',
        content_id: 'bg-image'
      }
    ],
    Email,
    User,
    notificationSource,
    sourceId
  });
};