import nodemailer from "nodemailer"
// import config from "../config/config.js";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure:true,
    port:465,
    auth:{
        user:config.USER,
        pass:config.PASS
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

export const sendMail = async  ( to , subject , msg , html )=>{

   try {
     const info  = await transporter.sendMail({
         from: `CampusCart <${config.USER}>`,
         to,
         subject:subject,
         text:msg,
         html:html
     })
     console.log(`Message sent ${info.messageId}`)
     return info;
   } catch (error) {
    console.log("error while sending OTP",error.message,error);
    throw error;
   }

}