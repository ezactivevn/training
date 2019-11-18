
import { protractor, browser, element, by } from 'protractor';
import { waitAndClickButtonByID, getCurrentTime } from '../providers/util';

export class HomePage {
	constructor(){
	}

	select(cardID) {
		waitAndClickButtonByID(cardID, 'Can not find ' + cardID);
	}
}

