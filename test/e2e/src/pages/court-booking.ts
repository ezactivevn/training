import { waitAndClickButtonByID } from '../providers/util';
import { buttonCourtBookingPage } from '../data/constants.js';

export class CourtBookingPage {
	constructor(){
	}

	book() {
		waitAndClickButtonByID(buttonCourtBookingPage.book_now, 'Can not find ' + buttonCourtBookingPage.book_now);
	}

}

