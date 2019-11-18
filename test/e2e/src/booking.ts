import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { ForgotPasswordPage } from './pages/forgot-password';
import { HomePage } from './pages/home';
import { CourtBookingPage } from './pages/court-booking';
import { NewBookingPage } from './pages/new-booking';
import { PaymentPage } from './pages/payment';
import { formNewUser, formRegisterPage, formForgotPasswordPage, cardHomePage } from './data/constants.js';
import { openSystem } from './providers/util';

// This E2E test will:
//
//      1 - Open a login page
//

var password:any = '';

describe('--- TASK: Court booking ---', () => {

describe('As a new player', () => {

	let loginPage = new LoginPage();
	let registerPage = new RegisterPage();
	let forgotPasswordPage = new ForgotPasswordPage();

	beforeEach(() => {
	});

	it('I want to register my name: player@gmail.com.', () => {
		openSystem();
		loginPage.register();
		registerPage.register(formRegisterPage).then(response => {
			password = response;
		});
	});

	it('And since I forget password mailed to me, I want to get a new one.', () => {
		openSystem();
		loginPage.resetPassword();
		forgotPasswordPage.reset(formForgotPasswordPage).then(response => {
			password = response;
			// console.log('ForgotPasswordPage - new password = ', password);
		});
	});
});

describe('Now as a player, I want to book a court', () => {

	let loginPage = new LoginPage();
	let homePage = new HomePage();
	let courtBookingPage = new CourtBookingPage();
	let newBookingPage = new NewBookingPage();
	let paymentPage = new PaymentPage();

	beforeEach(() => {
	});

	it('First I log in my name: player@gmail.com.', () => {
		openSystem();
		var form = formNewUser;
		form.values.password = password;
		loginPage.login(formNewUser);
	});

	it('Afterward select a location.', () => {
		homePage.select(cardHomePage.court);
	});

	it('Then view current bookings.', () => {
		courtBookingPage.book();
	});

	it('And then select a new booking with court type, date and time.', () => {
		newBookingPage.book();
	});

	it('Then finally confirm booking and make online payment.', () => {
		paymentPage.pay();
	});

	it('My booking is now complete!', () => {
	});

});

});
