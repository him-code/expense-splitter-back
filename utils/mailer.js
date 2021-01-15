const nodemailer = require("nodemailer");

const sendEmailPromise = async (sender, recepient, subject, text, body) => {
  const transporter = await nodemailer.createTransport({
    secure: true,
    service: "gmail",
    auth: {
      user: "himhn7@gmail.com",
      pass: "asdf@2021",
    },
  });
  if (!transporter)
    throw {error: "Error creating transporter while sending email", code: 400};

  return new Promise((resolve, reject) => {
    transporter.sendMail({ sender: "Team Expense Splitter", recepient, subject, text, body }).then(
      (res) => {
        console.log(`Email sent to ${recepient}`);
        resolve(res);
      },
      (err) => {
        reject("Error sending mail");
      }
    );
  });
};

module.exports = {
  sendEmailPromise,
};
