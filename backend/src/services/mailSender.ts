import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.MAIL_LOGIN,
		pass: process.env.MAIL_PASSWORD
	}
});
  
const source = fs.readFileSync('./src/templates/activationMail.html', 'utf-8').toString();
const template = handlebars.compile(source);

export async function sendActivationLink(userMail: string, activationCode: string, username: string) {
	const replacements = {
		activationLink: `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/user/activate?username=${username}&activationCode=${activationCode}`,
		username: username
	};
	const htmlToSend = template(replacements);
	const mailOptions = {
		from: process.env.MAIL_LOGIN,
		to: userMail,
		subject: 'Welcome in Card Game!',
		html: htmlToSend
	};
	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});

}
