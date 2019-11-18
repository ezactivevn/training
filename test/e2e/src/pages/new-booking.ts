import { waitAndClickButtonByID, processConfirm } from '../providers/util';
import { idNewBookingPage } from '../data/constants.js';

export class NewBookingPage {
	constructor(){
	}

	book() {
		waitAndClickButtonByID(idNewBookingPage.book_now, 'Can not find ' + idNewBookingPage.book_now);
		processConfirm();
	}
}

