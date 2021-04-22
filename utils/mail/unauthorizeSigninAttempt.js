const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.unauthorizeSigninAttempt = async (email, name, data) => {
  return await sgMail.send({
    to: email,
    from: process.env.SENDGRID_EMAIL_FROM,
    subject: `Unauthorize attempt detected`,
    html: `
      <div style="padding:10px;max-width:700px;margin:20px auto;width:100%;">
        <h3 style="width:100%;text-align:left;padding:5px 0 20px 0;border-bottom:2px solid lightgrey;">Unauthorized activity Alert!!!</h3>
        <h3 style="width: 100%";color:orange;padding:10px 0;>Hello ${name},</h3>
        <p style="width:100%;padding:5px 0";margin-bottom:10px;>
          We have detected someone try to get access to your account. So, we deactivate your account for atleast 24 hours. We will review and activate your account. Please contact us for early activation. 
        </p>
        <h3 style="width: 100%";color: red;padding:10px 0;>Unauthorize Activites</h3>
        <div style="background-color:#fac5c5;border: 2px solid #fc4747;">
            <div style="width:100%;display:flex;padding: 10px 10px;box-shadow: 0px 3px 0px -1px #000000;">
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[0].type}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[0].desc}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[0].date}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[0].time}</div>
            </div>
            <div style="width:100%;display:flex;padding:5px;padding: 20px 0;box-shadow: 0px 3px 0px -1px #000000;">
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[1].type}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[1].desc}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[1].date}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[1].time}</div>
            </div>
            <div style="width:100%;display:flex;padding:5px;padding: 20px 0;box-shadow: 0px 3px 0px -1px #000000;">
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[2].type}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[2].desc}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[2].date}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[2].time}</div>
            </div>
            <div style="width:100%;display:flex;padding:5px;padding: 20px 0;box-shadow: 0px 3px 0px -1px #000000;">
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[3].type}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[3].desc}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[3].date}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[3].time}</div>
            </div>
            <div style="width:100%;display:flex;padding:5px;padding: 20px 0;box-shadow: 0px 3px 0px -1px #000000;">
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[4].type}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[4].desc}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[4].date}</div>
              <div style="max-width:calc(100% /5);width:calc(100% /5);margin: 0 auto;">${data[4].time}</div>
            </div>
          <br />
        </div>
        <a style="padding:5px 0;" href="http://www.coocoontechlab.com/contact" >
          <button style="margin:10px 0;padding:10px 20px;height:max-content;font-size:18px;background-color:blue;color:white;">
            Contact Us 
          </button>
        </a>
      </div>
    `
  });
}