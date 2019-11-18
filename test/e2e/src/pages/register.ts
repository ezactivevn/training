import { waitTillElementReady, fillFormData, processAlert } from '../providers/util';

export class RegisterPage {
	constructor(){
	}

	register(formData) {
		return new Promise((resolve, reject) => {
			waitTillElementReady(formData.id_button, 'Can not find ' + formData.id_button);
			// console.log('RegisterPage.register - formData = ', formData);
			fillFormData(formData);
			processAlert().then(text => {
				var arr = text.split('|');
				let password = arr[1].trim();
				resolve(password);
			});
		});
	}
}

