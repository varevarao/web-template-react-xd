// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.sendMail = async (req, res) => {
  // IE8 does not support domains, only *
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Accept')

  if (req.method === 'OPTIONS') {
    res.end();
  } else if (req.headers.origin && req.headers.origin.startsWith(process.env.WEB_HOST)) {
    const { name, email, comments } = req.body;

    const msg = {
      to: process.env.TO_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: `Information Request from ${name} (${email}) `,
      html: `Hello, <br/>You have a <b>new request for information</b> via <i>irahconsulting.com</i><br/><br/><b>Name:</b> ${name} <br/><b>Email:</b> ${email} <br/><b>Comments:</b> ${comments} <br/>`,
    };

    try {
      await sgMail.send(msg);
      res.status(200).send();
    } catch (e) {
      res.status(500).send();
    }
  } else {
    console.error(`Received request from unknown host: ${req.headers.origin} Headers: ${JSON.stringify(req.headers)}`);
    res.status(400).send({ error: 'Unknown host' });
  }
};

