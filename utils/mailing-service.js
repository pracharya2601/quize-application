const nodemailer = require('nodemailer');
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}))

const sendSignUpMessage = async (email, name, code) => {
    let mailStat;
    try {
        await transporter.sendMail({
            to: email,
            from: process.env.SENDGRID_EMAIL_FROM,
            subject: 'Verify Your Account',
            text: `Welcome to the lotto server, ${name}. Yout verification code is ${code} Please use this code to verify nyout account.`,
        });
        mailStat = true;
    } catch (e) {
        console.log(e);
        mailStat = false;
    }
    return mailStat;
};

const sendQuizeStartMesssage = async (email) => {
    return await transporter.sendMail({
        to: email,
        from: process.env.SENDGRID_EMAIL_FROM,
        subject: 'You Started Playing quize',
        text: `You started the quize. Please follow the protocles to submit the answer`,
    });
}

exports.sendSignUpMessage = sendSignUpMessage;
exports.sendQuizeStartMesssage = sendQuizeStartMesssage;