const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.signupMessage = async (email, name, code, createdeAt ) => {
  return await sgMail.send({
    to: email,
    from: process.env.SENDGRID_EMAIL_FROM,
    subject: `Creating account with quize.com`,
    html: `
      <div style="padding:10px;max-width:700px;margin:20px auto;width:100%;">
        <h3 style="width:100%;text-align:left;padding:5px 0 20px 0;border-bottom:2px solid lightgrey;">Account Information</h3>
        <div style="width:100%";height:2px;background-color:grey;margin:10px 0;"/>
        <h3 style="width: 100%";color:orange;padding:10px 0;>Hello ${name},</h3>
        <p style="width:100%;padding:5px 0";margin-bottom:10px;>Thankyou for creating account with us. This is your first step to earn money by playing quize. Before you signin we would like to make sure to confirm this email is assosiate with you. Please click verify botton to verify your email.</p>
        <h3 style="width: 100%";color:orange;padding:10px 0;>Verify your account</h3>
        <div style="width:100%";height:2px;background-color:grey;margin:10px 0;"/>
        <div style="background-color:lightgrey;padding: 20px 0;border: 2px solid grey">
          <div style="display:flex;justify-content:space-between;padding:5px;">
            <div>Name: ${" "}</div>
            <div style="color: green;">${name}</div>
          </div>
          <div style="display:flex;justify-content:space-between;padding:5px;">
            <div>Total Email:${" "}</div>
            <div style="color:green;">${email}</div>
          </div>
          <div style="display:flex;justify-content:space-between;padding:5px;">
            <div>Account created on:${" "}</div>
            <div style="color:green;">${createdeAt}</div>
          </div>
          <a href="http://www.coocoontechlab.com/auth/user/verify/${email}/${code}" style="margin:15px 0;padding:5px;">
            <button style="padding:10px 20px;height:max-content;font-size:18px;">
              Verify Your Email
            </button>
          </a>
          <p style="font-size:10px;margin-top:50px;padding:5px;color:teal">
            This email is send to ${email}. By creating the account with us you accept the term and condition and privacy policy of our compaly.
          </p>
        </div>
      </div>
    `
  });
}