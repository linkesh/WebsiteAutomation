/***********************************************************************
 *                                        						       *
 * Author: Siddharth Shanker               						       *
 * Date: December, 2018.                            			   	   *
 * GitHub: https://github.com/Shankerthebunker62/WebsiteAutomation.git *
 *                                        						       *
 ***********************************************************************/

// Fetches static variables
const StaticModule = require(`/Users/shankerthebunker/git/WebsiteAutomation/test/e2e/staticModule.js`);
let _StaticModule = new StaticModule();

// https://www.w3schools.com/nodejs/nodejs_filesystem.asp
let fs = require('fs');

/**
 * Conversion of the log4js framework to work with node.
 */
const console = require(_StaticModule.projectPath() + '/test/e2e/utils/logger/logModule.js');

fetchMailBody = function () {
	let mailBody = ``;
	
	fs.readFile(_StaticModule.fileName(), 'utf8', (error, data) => {
		if (error) {
			console.error(`error: ${error.message}, stackTrace ${error.stack}`);
		} else {
			console.log(`Attaching report to mail body`);
			mailBody = data;
		}
	});
	
	return mailBody;
};

exports.sendMailI = async function () {
	// https://www.npmjs.com/package/nodemailer
	let nodemailer = require('nodemailer');
	
	const smtpConfig = {
			service: _StaticModule.service(), // when using service block host and, port config
		    
		    host: _StaticModule.host(),
		    port: _StaticModule.port(),

		    auth: {
		        user: _StaticModule.userName(),
		        pass: _StaticModule.password()

		    },
		    
		    requireTLS: true,
		    secureConnection: true,
		    
		    tls: {
		        ciphers: 'SSLv3',
		        rejectUnauthorized: true
		    },
		    
		    debug: true,
		    logger: true
	};
	
	const mailOptions = {
			from : _StaticModule.userName(),
			to : _StaticModule.mailRecipients(),
			subject : `${_StaticModule.feature()} via Node.js`,
			html : fetchMailBody()
	};
	
	let transporter = nodemailer.createTransport(smtpConfig);
	
	transporter.verify((error, success) => {
	    if (error)
	    	console.error(`Your config is incorrect, error: ${error.message}, stackTrace ${error.stack}`);
	    else {
	    	console.log(`Your config is correct, success: ${success}`);
	    	console.log(`Sending email to mail recipents: ${_StaticModule.mailRecipients()}`);
	    }
	});
	
	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.error(`Email sending failed, error: ${error.message}, stackTrace ${error.stack}`);
		} else {
			console.log(`Email sent: ${info.response}`);
		}
	});
	
	return;
};

exports.sendMailII = async function () {
	// https://www.npmjs.com/package/sendmail
	const sendmail = require('sendmail')({
		  logger: {
		    debug: console.log,
		    info: console.info,
		    warn: console.warn,
		    error: console.error
		  },
		  silent: false,
		  auth: {
		        user: _StaticModule.userName(),
		        pass: _StaticModule.password()

		  },
		  dkim: { // Default: False
		    privateKey: fs.readFileSync(_StaticModule.projectPath() + '/test/e2e/utils/report/dkim-private.pem', 'utf8'),
		    keySelector: 'mydomainkey'
		  },
		  smtpPort: _StaticModule.port(), // Default: 25
		  smtpHost: _StaticModule.host()  // Default: -1 - extra smtp host after resolveMX
		});
	
	sendmail({
	    from: _StaticModule.sender(),
	    to: _StaticModule.mailRecipients(),
	    subject: `${_StaticModule.feature()} via Node.js`,
	    html: fetchMailBody(),
	  }, function(error, info) {
			if (error) {
				console.error(`Email sending failed, error: ${error.message}, stackTrace ${error.stack}`);
			} else {
				console.dir(`Email sent: ${info.response}`);
			}
	});
	
	return;
};

exports.sendMailIII = async function () {
	//https://www.npmjs.com/package/emailjs
	let email 	= require('emailjs');
	
	let server 	= email.server.connect({
	   user:	 _StaticModule.userName(), 
	   password: _StaticModule.password(), 
	   host:		_StaticModule.host(), 
	   tls: {
		   ciphers: 'SSLv3'
	   }
	});
	
	let message	= {
			text:	fetchMailBody(), 
			from:	_StaticModule.sender(), 
			to:		_StaticModule.mailRecipients(),
			cc:		_StaticModule.userName(),
			subject: `${_StaticModule.feature()} via Node.js`,
	};
	
	server.send(message, function(error, info) { 
		if (error) {
			console.error(`Email sending failed, error: ${error.message}, stackTrace ${error.stack}`);
		} else {
			console.dir(`Email sent: ${info.response}`);
		}
	});
	
	return;
};

exports.sendMailIV = async function () {
	// https://www.npmjs.com/package/email
	let Email = require('email').Email;
	
	let messageOption = {
			from: _StaticModule.sender(), 
			to:   _StaticModule.mailRecipients(),
			subject: `${_StaticModule.feature()} via Node.js`,
			body: fetchMailBody()
	};
	
	let message = new Email(messageOption);
	
	message.send(function(error) {
		if (error) {
			console.error(`Email sending failed, error: ${error.message}, stackTrace ${error.stack}`);
		} else {
			console.dir(`Email sent successfully !!`);
		}
	});
	
	return;
};

exports.sendMailIV = async function () {
	// https://www.npmjs.com/package/node-ews
	const EWS = require('node-ews');
	
	// exchange server connection info
	const ewsConfig = {
	  username: _StaticModule.userName(),
	  password: _StaticModule.password(),
	  host: 'https://ews.domain.com' // _StaticModule.host()
	};
	
	const options = {
			rejectUnauthorized: false,
			strictSSL: false
	};
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
			
	// initialize node-ews
	const ews = new EWS(ewsConfig, options);
	
	// define ews api function
	const ewsFunction = 'ExpandDL';

	// define ews api function args
	const ewsArgs = {
	  'Mailbox': {
	    'EmailAddress': _StaticModule.mailRecipients()
	  }
	};

	// query EWS and print resulting JSON to console
	ews.run(ewsFunction, ewsArgs).then(result => {
		console.log(JSON.stringify(result));
	}).catch(error => {
		console.error(`error: ${error.message}, stackTrace ${error.stack}`);
	});
	
	return;
};

exports.sendMail = async function () {
	// https://www.npmjs.com/package/exchange-web-service
	const ews = require("exchange-web-service").ews;
	
	ews.config(_StaticModule.userName(), _StaticModule.password(), _StaticModule.mailURL(), _StaticModule.mailDomain());
	ews.sendMail(_StaticModule.mailRecipients(), `${_StaticModule.feature()} via Node.js`, fetchMailBody());
	
	return;
};

exports.createTask = async function () {
	// https://www.npmjs.com/package/exchange-web-service
	const ews = require("exchange-web-service").ews;
	
	ews.config(_StaticModule.userName(), _StaticModule.password(), _StaticModule.mailURL(), _StaticModule.mailDomain());
	
	//ews.createTask('task title', '<due date and time in format:2016-10-26T21:32:52>');
	ews.createTask('My Task Title', '2016-10-26T21:32:52');
	
	return;
};

exports.createAppointment = async function () {
	// https://www.npmjs.com/package/exchange-web-service
	const ews = require("exchange-web-service").ews;
	
	ews.config(_StaticModule.userName(), _StaticModule.password(), _StaticModule.mailURL(), _StaticModule.mailDomain());
	
	// ews.createAppointment('Subject of Appointment', 'Body of appointment', 'Start date in UTC eg.2016-08-03T21:32:52Z', 'End date in UTC eg.2016-08-03T22:32:52Z', ews.constants.CalendarBusyStatus.<Free|Tentative|Busy|OutOfOffice|NoStatus|WorkingElsewhere>, 'Location of appointment');
	ews.createAppointment('Meet a colleague', 'Meet Paul', '2016-08-03T21:32:52Z', '2016-08-03T22:32:52Z', ews.constants.CalendarBusyStatus.OutOfOffice, 'Coffee Corner');
	
	return;
};