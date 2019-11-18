const formExistingUser =  {
	page: 'LoginPage',
	values: { 	email: 'info@sgbasketball.com', password: '12345' },
	id_button: 'btnLogin'
};
module.exports.formExistingUser=formExistingUser;

const formNewUser =  {
	page: 'LoginPage',
	values: { 	email: 'player@gmail.com', password: '1234' },
	id_button: 'btnLogin'
};
module.exports.formNewUser=formNewUser;

const formRegisterPage =  {
	page: 'RegisterPage',
	values: { 	
		first_name: 'John',
		last_name: 'Player',
		mobile: '12345678',
		email: 'player@gmail.com'
	},
	id_button: 'btnRegister'
};
module.exports.formRegisterPage=formRegisterPage;

const formForgotPasswordPage =  {
	page: 'ForgotPasswordPage',
	values: { 	email: 'player@gmail.com' },
	id_button: 'btnReset'
};
module.exports.formForgotPasswordPage=formForgotPasswordPage;

const cardHomePage =  {
	court: 'crdCourtBooking',
	academy: 'crdAcademy',
	cbl: 'crdLeague'
};
module.exports.cardHomePage=cardHomePage;

const buttonCourtBookingPage =  {
	book_now: 'btnNewBooking'
};
module.exports.buttonCourtBookingPage=buttonCourtBookingPage;

const idNewBookingPage =  {
	sel_location: 'selLocation',
	sel_court: 'selCourtType',
	date: 'dtpDate',
	start_time: 'dtpStartTime',
	end_time: 'dtpEndTime',
	book_now: 'btnBookNow'
};
module.exports.idNewBookingPage=idNewBookingPage;

const idPaymentPage =  {
	card_number: 'txtCardNumber',
	expiry_month: 'txtExpMonth',
	expiry_year: 'txtExpYear',
	CVC: 'txtCvc',
	pay_now: 'btnPayNow'
};
module.exports.idPaymentPage=idPaymentPage;


