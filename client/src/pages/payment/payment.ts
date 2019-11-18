import { Component, Input } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Platform, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Stripe } from '@ionic-native/stripe';
import moment from 'moment';

// provider
import { ServerProvider } from '../../providers/server';
import { PromptProvider } from '../../providers/prompt';
import { SERVER_PATH, TEST_ENVIRONMENT, STRIPE_PUBLISHABLE_KEY } from '../../app/config';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  @Input() form : FormGroup;
  validation_messages: any;
  submitAttempt: boolean = false;
  yearValues;
  booking_id: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public formBuilder: FormBuilder,
    private stripe: Stripe,
    public server: ServerProvider,
    public prompt: PromptProvider,
  ) {
    this.booking_id = this.navParams.get('booking_id');
    this.setForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

  private setForm() {
    let year = moment().year();
    this.yearValues = "[" + year + ", " + (year+1) + ", " + (year+2) + "]";
    
    this.validation_messages = {
      'number': [
        { type: 'required', message: 'Please enter a mobile number' },
        { type: 'minlength', message: 'Card number must be at least 12 characters long' },
        { type: 'maxlength', message: 'Card number cannot be more than 20 characters long' },
        { type: 'pattern', message: 'Please enter a valid mobile number' },
      ],
      'expMonth': [
        { type: 'required', message: 'This field is required' },
        { type: 'min', message: 'Expiry month must be at least 1' },
        { type: 'max', message: 'Expiry month cannot be more than 12' },
        { type: 'pattern', message: 'Please enter a valid expiry month' },
      ],
      'expYear': [
        { type: 'required', message: 'This field is required' },
        { type: 'minlength', message: 'Expiry year must be at least 4 characters long' },
        { type: 'maxlength', message: 'Expiry year cannot be more than 4 characters long' },
        { type: 'pattern', message: 'Please enter a valid expiry year' },
      ],
      'cvc': [
        { type: 'required', message: 'This field is required' },
        { type: 'minlength', message: 'CVC must be at least 3 characters long' },
        { type: 'maxlength', message: 'CVC cannot be more than 3 characters long' },
        { type: 'pattern', message: 'Please enter a valid CVC' },
      ]
    }

    this.form = this.formBuilder.group({
      number: new FormControl('4242424242424242', Validators.compose([Validators.required, Validators.minLength(12), Validators.maxLength(20), Validators.pattern('[0-9]*')])),
      expMonth: new FormControl('12', Validators.compose([Validators.required, Validators.min(1), Validators.max(12), Validators.pattern('[0-9]*')])),
      expYear: new FormControl('2020', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]*')])),
      cvc: new FormControl('220' , Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(3), Validators.pattern('[0-9]*')])),
    });
  }

  payNow() {
    this.submitAttempt = true;
    if (this.form.valid) {
      // check cordova is available
      this.platform.ready().then(() => {
        if (this.platform.is('cordova')) {
          let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Please wait...'
          });
          loading.present();
          // set publish key
          this.stripe.setPublishableKey(STRIPE_PUBLISHABLE_KEY);
          // get card
          let card = this.form.value;
          // create card token
          this.stripe.createCardToken(card)
            .then(token => {
              loading.dismiss();
              console.log(token.id);
              // sent card token to server
              this.paymentCourtBooking(token.id);
            })
            .catch(error => {
              loading.dismiss();
              console.error(error)
            });

        } else {
          let token = 'test_token';
          this.paymentCourtBooking(token);
        }
      });
      
    }
  }

  paymentCourtBooking(token_id) {
    let params = { booking_id: this.booking_id, token: token_id };
    this.server.post(SERVER_PATH + '/client/paymentCourtBooking', params, { okMessage: 'INFORMATION', errorMessage: 'ERROR', showLoading: true, testMode: TEST_ENVIRONMENT }).then(
      (response: any) => {
        let data = { 'payment_id': response.info };
        this.viewCtrl.dismiss(data);
      },
      (reject: any) => { });
  }

}
