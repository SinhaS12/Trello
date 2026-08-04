import { error } from 'console';
import { Resend } from 'resend';
if (!process.env.RESEND_API_KEY) {
    throw error("Can,t access the resend!")
}

const resend = new Resend(process.env.RESEND_API_KEY);




export function sendtounsigned(sendEmail:string,recieveEmail:string) {
    resend.emails.send({
        from: sendEmail,
        to: recieveEmail,
        subject: 'Invited From trello!',
        html: '<p>Please <strong>Signup first to get the access of the trello!</p>'
    });
}