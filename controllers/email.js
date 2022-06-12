var nodemailer = require("nodemailer");

module.exports = sendEmail = (recive, subject, text) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "wizewallet1@gmail.com",
        pass: "swmcrazworsxbeez",
      },
    });
  
    var mailOptions = {
      from: "wizewallet1@gmail.com",
      to: `${recive}`,
      subject: `${subject}`,
      text: `${text}`,
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  };

//sendEmail("alonlevy5@gmail.com", "Task", "You got a new task")
