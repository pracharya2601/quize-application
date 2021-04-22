const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports.sendVerifiedMessage = async (email) => {
    return await sgMail.send({
        to: email,
        from: process.env.SENDGRID_EMAIL_FROM,
        subject: 'Your account is verrified',
        text: `Your Account is Verified. Please Signin to your account to play quize.`,
    });
}

module.exports.sendTemporaryPass = async (email, pass) => {
    return await sgMail.send({
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
    return await sgMail.send({
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
    return await sgMail.send({
        to: email,
        from: process.env.SENDGRID_EMAIL_FROM,
        subject: 'You Started Playing quize',
        text: `You started the quize. Please follow the protocles to submit the answer`,
    });
}