const nodemailer = require('nodemailer');

const sendEmailPromise = async(mailData) => {

    const transporter = await nodemailer.createTransport({
        secure: true,
        service: config.email['service'],
        auth: config.email['auth']
    });
    if (!transporter)
        throw { error: 'Error creating transporter while sending email', code: 400 }

    const mailObject = { sender, recepient, subject, text, body };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailObject).then((res) => {
            console.log(`Email sent to ${recepient}`);
            resolve(res);
        }, (err) => {
            reject('Error sending mail');
        })
    });
}

module.exports = {
    sendEmailPromise,
};