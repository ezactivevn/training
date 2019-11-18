import { protractor, browser, element, by } from 'protractor';
import { HttpClient, ResponsePromise } from "protractor-http-client";

export const SLEEP_TIME = 500;				// 0.5 sec
export const WAIT_TIME = 1000;				// 3 sec
export const SHORT_SLEEP_TIME = 500;		// 0.5 sec
export const SHORT_WAIT_TIME = 500;			// 3 sec

export const TO_UPPERCASE = true;
export const TAG_TYPE = 'tag';
export const CSS_TYPE = 'css';

export function openSystem() {
	browser.get('');
}

export function post(url: string, params: any, callback) {
	const http = new HttpClient();
	var options = {
		url: url,
		method: 'POST',
		formData: params
	};
	let response:ResponsePromise = http.request(options);
	response.then(onFulfilled => {
		let body = JSON.parse(onFulfilled);
		// console.log('Response = ', response);
		callback(body);
	}, onRejected => {
		console.log('Error = ', onRejected);
	});
}

export function fillFormData(formData) {
	// send keys to fill form
	let page = formData.page;
	let values = formData.values;
	let count = Object.keys(values).length;
	let idx = 0;
	for(var key in values) {
		let value = values[key];
		getTextInputElement(page, idx++, count).then(ele => ele.sendKeys(value));
	}
	let id_button = formData.id_button;
	waitAndClickButtonByID(id_button, 'Can not find ' + id_button);
}

export function getTextInputElement(page, idx, count): Promise<any> {
	return new Promise((resolve, reject) => {
		let list = element.all(by.css('.text-input'));
		list.count().then(value => {
			if (value > count) {
				// number of controls is more than no.controls of current page, adjust
				idx += value - count;
				// console.log('page, value, count, idx = ', page + ', ' + value + ', ' + count + ',' + idx);
			}
			resolve(list.get(idx));
		});
	});
}

export function getTextInput(pages: {}, page: string, name: string): Promise<any> {
	return new Promise((resolve, reject) => {
		let p = pages[page];
		let count = Object.keys(p).length;
		let idx = p[name];
		let list = element.all(by.css('.text-input'));
		// verify count and adjust if necessary
		list.count().then(value => {
			if (value > count) {
				// number of controls is more than no.controls of current page, adjust
				idx += value - count;
				// console.log('value, count, idx = ', value+','+count+','+idx);
			}
			// console.log('page, name = ', page + ',' + name + ',' + idx);
			let ele = list.get(idx);
			resolve(ele);
		});
	});
}

export function processAlert(): Promise<any> {
	return new Promise((resolve) => {
		// show AlertBox
		var EC = protractor.ExpectedConditions;
		// Waits for the element with id 'abc' to be clickable.
		browser.wait(EC.elementToBeClickable(element(by.css('.alert-message'))), SHORT_WAIT_TIME, "Can not find alert-message");
		let alertMessage = element(by.css('.alert-message'));
		alertMessage.isPresent().then(present => {
			// console.log('alertMessage is present: ', present);
			alertMessage.getText().then(text => {
				let alertButton = element(by.css('.alert-button'));
				alertButton.isPresent().then(pres => {
					// console.log('alertButton is present: ', pres);
					alertButton.click();
					browser.sleep(SHORT_SLEEP_TIME);
					resolve(text);
				});
			});
		});
	});
}

export function processConfirm() {
	// in showConfirmAlert
	let okButton = element.all(by.css('.alert-button')).last();
	var EC = protractor.ExpectedConditions;
	expect(EC.elementToBeClickable(okButton)).toBeTruthy();
	waitAndClickButtonByElement(okButton, 'Can not find OK button');
}

export function waitTillElementReady(id, message) {
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.elementToBeClickable(element(by.id(id))), SHORT_WAIT_TIME, message);
}

export function waitAndClickButton(id, message) {
	waitAndClickButtonByID(id, message);
}

export function waitAndClickButtonByID(id, message) {
	waitAndClickButtonByElement(element(by.id(id)), message);
}

export function waitAndClickElement(element: any, message) {
	waitAndClickButtonByElement(element(by.css(element)), message);
}

export function waitAndClickButtonByElement(element: any, message) {
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.elementToBeClickable(element), SHORT_WAIT_TIME, message);
	element.click();
	browser.sleep(SHORT_SLEEP_TIME);
}

export function showElements(page: any, parentElement: any, selector: any, type: any, showHtml: any) {
	let list = null;
	let msg = '';
	if (parentElement) {
		list = (type == TAG_TYPE) ? parentElement.all(by.tagName(selector)) : parentElement.all(by.css(selector));
		msg = 'parent(' + type + ')'
	} else {
		list = (type == TAG_TYPE) ? element.all(by.tagName(selector)) : element.all(by.css(selector));
		msg = '(' + type + ')';
	}
	list.count().then(value => {
		console.log('  ');
		console.log('--- ' + page + ' --- ' + msg + ' --- ' + selector + ' ---');
		console.log(' COUNT: ' + value);
		if (showHtml) {
			console.log(' HTML - ');
			let count = 0;
			list.each(function(elem) {
				elem.getAttribute('outerHTML').then(value => {
					// let val = value.substring(0,DATA_SIZE) + ' ... ' + value.substring(value.length - DATA_SIZE);
					let val = value;
					console.log('  ' + ++count + ' : '  + val);  
				});
			});
		}
		console.log('--- ' + page + ' --- END ---');
	});
}

export function getCurrentTime() {
	var today = new Date();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	return time;
}
