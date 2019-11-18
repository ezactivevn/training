import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

// model
import { User } from '../../models/user';
// provider
import { ServerProvider } from '../../providers/server';
import { PromptProvider } from '../../providers/prompt';
import { SERVER_PATH, TEST_ENVIRONMENT } from '../../app/config';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user: User;
  validation_messages: any;
  submitAttempt: boolean = false;
  @Input() form : FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public server: ServerProvider,
    public prompt: PromptProvider
  ) {
    this.setForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  private setForm() {
    this.validation_messages = {
      'first_name': [{ type: 'required', message: 'Please enter your first name' },],
      'last_name': [{ type: 'required', message: 'Please enter your other name' },],
      'mobile': [
        { type: 'required', message: 'Please enter a mobile number' },
        { type: 'minlength', message: 'Phone number must be at least 8 characters long' },
        { type: 'maxlength', message: 'Phone number cannot be more than 8 characters long' },
        { type: 'pattern', message: 'Please enter a valid mobile number' },
      ],
      'email': [{ type: 'email', message: 'Please enter a valid email' },]
    }

    this.form = this.formBuilder.group({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('[0-9]*')])),
      email: new FormControl('', Validators.email),
    });
  }

  // Register account
  register() {
    this.submitAttempt = true;
    if (this.form.valid) {
      let data = this.form.value;
      let params = { first_name: data.first_name, last_name: data.last_name, mobile: data.mobile, email: data.email };
      this.server.post(SERVER_PATH + '/client/register', params, { okMessage: 'INFORMATION', errorMessage: 'ERROR', showLoading: true, testMode: TEST_ENVIRONMENT }).then(
        (response: any) => {
          this.user = response.user;
          this.navCtrl.pop();
        },
        (reject: any) => { });
    }
  }

}
