// const nodemailer = require('nodemailer');
// const sgTransPort = require('nodemailer-sendgrid-transport');

// const transporter = nodemailer.createTransport(sgTransPort({
//     auth: {
//         api_user: process.env.SENDGRID_API_USER,
//         api_key: process.env.SENDGRID_API,
//     }
// }))


// const sendSignUpMessage = async (email, code) => {

//     try {
//         return await transporter.sendMail({
//             to: email,
//             form: `noreply@quize.com`,
//             subject: `Verification of creating account`,
//             html: `
//              <div>
//                  <h4>Thankyou for creating account with us.</h4>
//                  <h4>To verify the account please use this number code <code>${code}.</h4>
//                  <br/>
//                  <br/>
//                  <p> If you are not careating account with this email please contact us at bla@bla.com </p>
//              </div>
//             `
//          })
//     } catch (e) {
//         console.log(e)
//     }
// }
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API);


const sendSignUpMessage =async (email, code) => {
    const message = {
        to: email,
        form: `noreply@quize.com`,
        subject: `Verification of creating account`,
        html: `
         <div>
             <h4>Thankyou for creating account with us.</h4>
             <h4>To verify the account please use this number code <code>${code}.</h4>
             <br/>
             <br/>
             <p> If you are not careating account with this email please contact us at bla@bla.com </p>
         </div>`
    }
    return await sgMail.send(message)
}


exports.sendSignUpMessage = sendSignUpMessage;