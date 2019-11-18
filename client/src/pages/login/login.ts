import { Component, Input } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

// model
import { User } from '../../models/user';
import { JsonResultMask } from '../../models/json-result-mask';
// page
import { RegisterPage } from '../register/register';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { HomePage } from '../home/home';
// provider
import { ServerProvider } from '../../providers/server';
import { PromptProvider } from '../../providers/prompt';
import { SERVER_PATH, TEST_ENVIRONMENT } from '../../app/config';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: User;
  publishKey: 'publishKey';
  title: string = 'SG Basketball';
  validation_messages: any;
  submitAttempt: boolean = false;
  @Input() form : FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public server: ServerProvider,
    public prompt: PromptProvider,
    public storage: Storage,
    public events: Events
  ) {
    this.setForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  private setForm() {
    this.validation_messages = {
      'email': [{ type: 'email', message: 'Please enter a valid email' },],
      'password': [{ type: 'required', message: 'Please enter a password' },]
    };

    this.form = this.formBuilder.group({
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required),
    });
  }

  login() {
    this.submitAttempt = true;
    if (this.form.valid) {
      let data = this.form.value;
      let params = { email: data.email, password: data.password };
      this.server.post(SERVER_PATH + '/client/login', params, { errorMessage: 'ERROR', showLoading: true, testMode: TEST_ENVIRONMENT }).then(
        (response: any) => {
          console.log(response.user);
          this.user = response.user as User;
          this.loginSuccessfully(this.user);
        },
        (reject: any) => { });
    }
  }

  loginSuccessfully(user: User) {
    var params: JsonResultMask;
    params = new JsonResultMask();
    params.status = 'SIGN_IN';
    params.info = user;
    console.log(user);
    params.message = user.first_name + ' ' + user.last_name;

    // set a key/value
    this.storage.set('sgb_user', user);

    this.events.publish(this.publishKey, params);
    this.navCtrl.setRoot(HomePage, { user: user });
  }

  openRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }

  openForgotPasswordPage() {
    this.navCtrl.push(ForgotPasswordPage);
  }

}
