const nodemailer = require('nodemailer');
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}))

module.exports.sendSignUpMessage = async (email, name, code, id) => {
    return await transporter.sendMail({
        to: email,
        from: process.env.SENDGRID_EMAIL_FROM,
        subject: 'Verify Your Account',
        html: `<a href="http://localhost:3000/auth/user/verify/${email}/${code}">Click here to verify the email</a> `
    });
};

module.exports.sendVerifiedMessage = async (email) => {
    return await transporter.sendMail({
        to: email,
        from: process.env.SENDGRID_EMAIL_FROM,
        subject: 'Your account is verrified',
        text: `Your Account is Verified. Please Signin to your account to play quize.`,
    });
}

module.exports.sendTemporaryPass = async (email, pass) => {
    return await transporter.sendMail({
        to: email,
        from: process.env.SENDGRID_EMAIL_FROM,
        subject: 'Request forgot password code',
        html: `
            <div>
                <h3>You requested for password reser</h3>
                <p>Your temporary password is <code>${pass}</code></p>
                <p>This is random generated password. Please dont forgot to change your password once you login.</p>
                <br />
                <br />
                <p>If you did not request for password reset please contact us and change your password.</p>
            </div>
        `,
    });
}

module.exports.passChangedEmail = async (email) => {
    return await transporter.sendMail({
        to: email,
        from: process.env.SENDGRID_EMAIL_FROM,
        subject: 'Password Changed',
        html: `
            <div>
                <h3>Your password has been changed</h3>
                <br />
                <br />
                <p>If you did not request for password reset please contact us and change your password.</p>
            </div>
        `,
    });
}


module.exports.sendQuizeStartMesssage = async (email) => {
    return await transporter.sendMail({
        to: email,
        from: process.env.SENDGRID_EMAIL_FROM,
        subject: 'You Started Playing quize',
        text: `You started the quize. Please follow the protocles to submit the answer`,
    });
}