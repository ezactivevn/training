import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// model
import { JsonResultMask } from '../../models/json-result-mask';
// page
import { LoginPage } from '../login/login';
import { CourtBookingPage } from '../court-booking/court-booking';
// provider
import { PromptProvider } from '../../providers/prompt';
import { ServerProvider } from '../../providers/server';
// import { SERVER_PATH } from '../../app/config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public server: ServerProvider,
    public prompt: PromptProvider,
    public storage: Storage,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  openCourtBookingPage() {
    this.navCtrl.push(CourtBookingPage);
  }
  openAcademyPage() {
    this.prompt.showOKAlert('Notification', 'This feature is under development. Please try again later!');
  }
  openLeaguePage() {
    this.prompt.showOKAlert('Notification', 'This feature is under development. Please try again later!');
  }

  logout() {
    this.prompt.showConfirmAlert("Logout", "Do you want to logout?", "No", "Yes").then(
      res => {
        if (res) {
          var params: JsonResultMask;
          params = new JsonResultMask();
          params.status = 'SIGN_OUT';
          params.info = null;
          params.message = 'Sign in';

          // remove user in local data
          this.storage.remove('sgb_user');
          
          this.navCtrl.setRoot(LoginPage);
        }
      },
      err => {}
    );
  }

}
