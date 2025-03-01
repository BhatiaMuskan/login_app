import nodemailer from 'nodemailer';


export const sendDynamicMail = async ({ username, userEmail, text, subject }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'muskanbhatia3456789@gmail.com', // Your Gmail address
      pass: 'byspekynjbwtywny',             // Your App Password
    },
  });

  const emailText = `Hi ${username},\n\n${text}\n\nBest regards,\nYour Team`;

  const mailOptions = {
    from: 'muskanbhatia3456789@gmail.com', // Sender's email
    to: userEmail,                        // Recipient's email
    subject,                              // Subject line
    text: emailText,                      // Email body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return info.response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
