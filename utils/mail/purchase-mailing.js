const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.purchaseMessage = async (email, name, pointHistryId, count, points ) => {
  return await sgMail.send({
    to: email,
    from: process.env.SENDGRID_EMAIL_FROM,
    subject: `Your purchase order`,
    html: `
      <div style="padding:10px;max-width:400px;margin:20px auto;width:100%;">
        <h3 style="width:100%;text-align:center;padding:5px 0 20px 0;border-bottom:2px solid lightgrey;">Order Confirmation</h3>
        <div style="width:100%";height:2px;background-color:grey;margin:10px 0;"/>
        <h3 style="width: 100%";color:orange;padding:10px 0;>Hello ${name},</h3>
        <p style="width:100%;padding:5px 0";margin-bottom:10px;>This is the confirmation of your purchase</p>
        <h3 style="width: 100%";color:orange;padding:10px 0;>Details</h3>
        <div style="width:100%";height:2px;background-color:grey;margin:10px 0;"/>
        <div style="background-color:lightgrey;padding: 20px 0;border: 2px solid grey">
          <div style="display:flex;justify-content:space-between;padding:5px;">
            <div>Item counts:${" "}</div>
            <div style="color: green;">${count}</div>
          </div>
          <div style="display:flex;justify-content:space-between;padding:5px;">
            <div>Total Point Used:${" "}</div>
            <div style="color:green;">${points}</div>
          </div>
          <a href="http://www.coocoontechlab.com/dashboard/point/detail/${pointHistryId}" style="margin:15px 0;padding:5px;">
            <button style="padding:10px 20px;height:max-content;font-size:18px;">
              View Detail
            </button>
          </a>
        </div>
      </div>
    `
  });
}