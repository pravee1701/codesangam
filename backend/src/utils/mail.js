import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';



export const sendEmail = async (options) => {

    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "CodeSangam",
            link: "https://codesangam.com",
        },
    });
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

  const emailHtml = mailGenerator.generate(options.mailgenContent);
  
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        },
    });

    const mail = {
        from: "mail.codesangam.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    };

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error("Email service failed silently make sure you have provided your Mailtrap credentials in the .env file");
        console.error(error);
    }
};

export const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to CodeSangam! We're very excited to have you on board.",
            action: {
                instruction: "To verify your email please click on the following button", 
                button: {
                    color: "#22BC66",
                    text: "Verify your email",
                    link: verificationUrl,
                },
            },
            outro: "Need help? Just reply to this email, we'd love to help.",
        },
    };
};

export const forgotPasswordMailgenContent = (username, resetUrl) => {
    return {
        body: {
            name: username,
            intro: "We got a request to reset the password for our account.",
            action: {
                instruction: "To reset your password please click on the following button or link"
                ,
                button: {
                    color: "#22BC66",
                    text: "Reset your password",
                    link: resetUrl,
                },
            },
            outro: "Need help? Just reply to this email, we'd love to help.",

        },
    };
};

export const sendNotificationMailgenContent = (username, upcomingContests) => {
    return {
        body: {
            name: username,
            intro: "Here are the contest scheduled for tomorrow",
            table: {
                data: upcomingContests.map((contest) => ({
                    Name: contest.name,
                    Platform: contest.platform,
                    Url: contest.url,
                    Duration: contest.duration,
                    StartTime: new Date(contest.startTime).toLocaleString(),
                    EndTime: new Date(contest.endTime).toLocaleString(),
                })),
            },
            outro: "Good luck with your contest ! Stay tuned for more updates.",
        }
    }
}