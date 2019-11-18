import { Component, Input } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import moment from 'moment';

// model
import { User } from '../../models/user';
import { Location } from '../../models/location';
// page
import { PaymentPage } from '../payment/payment';
// provider
import { ServerProvider } from '../../providers/server';
import { PromptProvider } from '../../providers/prompt';
import { SERVER_PATH, TEST_ENVIRONMENT } from '../../app/config';

@Component({
  selector: 'page-new-booking',
  templateUrl: 'new-booking.html',
})
export class NewBookingPage {

  @Input() form : FormGroup;
  user: User;
  locations: Location;
  courtTypes: any = [
    { id: 'Full court', name: 'Full court' },
    { id: 'Haft court', name: 'Haft court' },
    { id: 'Zone', name: 'Zone' }
  ];
  yearValues;
  validation_messages: any;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public server: ServerProvider,
    public prompt: PromptProvider,
    public modalCtrl: ModalController
  ) {
    this.setForm();
    this.getLocations();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewBookingPage');
  }

  getLocations() {
    this.server.post(SERVER_PATH + '/client/getLocations').then(
      (response: any) => {
        this.locations = response.locations;
      },
      (reject: any) => { });
  }

  private setForm() {
    let year = moment().year();
    this.yearValues = "[" + year + ", " + (year+1) + ", " + (year+2) + "]";
    
    this.validation_messages = {
      'location': [{ type: 'required', message: 'This field is required' },],
      'court_type': [{ type: 'required', message: 'This field is required' },],
      'date': [{ type: 'required', message: 'This field is required' },],
      'start_time': [
        { type: 'required', message: 'This field is required' },
        { type: 'minlength', message: 'Phone number must be at least 8 characters long' },
        { type: 'maxlength', message: 'Phone number cannot be more than 8 characters long' },
        { type: 'pattern', message: 'Please enter a valid start_time number' },
      ],
      'end_time': [{ type: 'required', message: 'This field is required' },]
    }

    this.form = this.formBuilder.group({
      location: new FormControl(1, Validators.required),
      court_type: new FormControl('Full court', Validators.required),
      date: new FormControl(moment().format(), Validators.required),
      start_time: new FormControl('00:00' , Validators.required),
      end_time: new FormControl('00:00' , Validators.required),
    });
  }

  // Book now
  bookNow() {
    this.submitAttempt = true;
    if (this.form.valid) {
      let data = this.form.value;
      // confirm booking
      this.prompt.showConfirmAlert('Confirm booking', 'Are you sure want to booking?', 'No', 'Yes').then(
        res => {
          if (res) {
            let params = { location: data.location, court_type: data.court_type, date: data.date, start_time: data.start_time, end_time: data.end_time };
            this.server.post(SERVER_PATH + '/client/bookNow', params, { errorMessage: 'ERROR', showLoading: true, testMode: TEST_ENVIRONMENT }).then(
              (response: any) => {
                this.openPaymentPage(response.info);
              },
              (reject: any) => { });
          }
        },
        err => {}
      )
    }
  }

  openPaymentPage(booking_id) {
    const paymentModal = this.modalCtrl.create(PaymentPage, { 'booking_id': booking_id});
    paymentModal.onDidDismiss(data => {
      console.log(data);
      this.navCtrl.pop();
    });
    paymentModal.present();
  }

}
