import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// model
import { User } from '../../models/user';
import { Location } from '../../models/location';
// page
import { NewBookingPage } from '../new-booking/new-booking';
// provider
import { ServerProvider } from '../../providers/server';
import { SERVER_PATH } from '../../app/config';

@Component({
  selector: 'page-court-booking',
  templateUrl: 'court-booking.html',
})
export class CourtBookingPage {

  user: User;
  bookings: Location;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public server: ServerProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CourtBookingPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter CourtBookingPage');
    this.getBookingsByUser();
  }

  getBookingsByUser() {
    this.server.post(SERVER_PATH + '/client/getBookingsByUser').then(
      (response: any) => {
        this.bookings = response.bookings;
      },
      (reject: any) => { });
  }

  openNewBookingPage() {
    this.navCtrl.push(NewBookingPage);
  }

}
