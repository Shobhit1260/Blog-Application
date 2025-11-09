const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", 
            host: "smtp.gmail.com",
            port: 465, // Use 465 for SSL or 587 for TLS
            secure: true, // true for 465, false for 587
            auth: {
                user: process.env.SMTP_USER, // Your Gmail address
                pass: process.env.SMTP_PASS, // Your Gmail App Password (not regular password)
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER, // Must be your Gmail address
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html || options.text, // Support HTML emails
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(" Email sent successfully: " + info.messageId);
        return info;
    } catch (error) {
        console.error(" Email sending failed:", error.message);
        throw error;
    }
};

module.exports = sendEmail;
