import { protractor, browser, element, by } from 'protractor';
import { fillFormData, getCurrentTime, waitAndClickButtonByID, showElements, TAG_TYPE, TO_UPPERCASE } from '../providers/util';

export class LoginPage {
	constructor(){
	}

	debug() {
		// showElements('HomePage', null, 'ion-content', CSS_TYPE, true);
		// element(by.css('ion-content')).getText().then(text => {
		// 	// console.log('HomePage: text = ', text);
		// 	expect(text.trim()).toContain('The world is your oyster.');
		// });
		// showElements('LoginPage', null, 'button', TAG_TYPE, true);
		// console.log('time00 = ', getCurrentTime());
	}

	login(formData) {
		fillFormData(formData);
	}

	register() {
		// select 'Register account'
		waitAndClickButtonByID('lblRegister', 'Can not find lblRegister');
	}

	resetPassword() {
		waitAndClickButtonByID('lblOpenForgotPassword', 'Can not find lblOpenForgotPassword');
	}

}

