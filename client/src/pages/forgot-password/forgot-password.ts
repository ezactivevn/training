import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

// page
import { LoginPage } from '../login/login';
// provider
import { ServerProvider } from '../../providers/server';
import { SERVER_PATH, TEST_ENVIRONMENT } from '../../app/config';

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  form: FormGroup;
  validation_messages: any;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public server: ServerProvider
  ) {
    this.setForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  private setForm() {
    this.validation_messages = {
      'email': [{ type: 'email', message: 'Please enter a valid email' },],
    }

    this.form = this.formBuilder.group({
      email: new FormControl('', Validators.email),
    });
  }

  resetPassword() {
    this.submitAttempt = true;
    if (this.form.valid) {
      let data = this.form.value;
      this.server.post(SERVER_PATH + '/client/resetPassword', { email: data.email }, { okMessage: 'INFORMATION', errorMessage: 'ERROR', showLoading: true, testMode: TEST_ENVIRONMENT }).then(
        (response: any) => {
          this.navCtrl.setRoot(LoginPage);
        },
        (reject: any) => { });
    }
  }

}
