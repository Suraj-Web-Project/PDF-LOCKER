// Api/services/mail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendResumeEmail = async (toEmail, userName, userPassword, pdfBuffer, formattedName) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: 'Your Password-Protected Resume',
            text: `Hello ${userName},\n\nPlease find your generated resume attached to this email.\n\nIMPORTANT: Your PDF is password protected.\nYour Password is: ${userPassword}\n\nBest Regards,\nResume Builder Team`,
            attachments: [{
                filename: `${formattedName}_Resume.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf'
            }]
        });
        return { success: true };
    } catch (error) {
        console.error("Mail Service Error:", error);
        throw error;
    }
};

module.exports = { sendResumeEmail };