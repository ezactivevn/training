import { waitAndClickButtonByID, processAlert } from '../providers/util';
import { idPaymentPage } from '../data/constants.js';

export class PaymentPage {
	constructor(){
	}

	pay() {
		waitAndClickButtonByID(idPaymentPage.pay_now, 'Can not find ' + idPaymentPage.pay_now);
		// processAlert().then(text => {
		// 	// var arr = text.split('|');
		// 	// let password = arr[1].trim();
		// });
	}
}

