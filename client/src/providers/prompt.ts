import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';

@Injectable()
export class PromptProvider {

  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) { }

  showLogMessage(mode: string, message: string, object: any) {
    let msg = mode + ' - ' + message;
    console.log(msg, object);
  }

  showOKAlert(title, message): Promise<boolean> {
    return new Promise((resolve) => {
      let alert = this.alertCtrl.create({
        title: title,
        message: message,
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              resolve(true);
            }
          }
        ]
      });
      alert.present();
    });
  }

  showConfirmAlert(title, message, noMsg, yesMsg): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: title,
        message: message,
        enableBackdropDismiss: false,
        buttons: [
          {
            text: noMsg,
            handler: data => {
              reject(false);
            }
          },
          {
            text: yesMsg,
            handler: data => {
              resolve(true);
            }
          }
        ]
      });
      alert.present();
    });
  }

  showRadioAlert(arr, title, btnText): Promise<string> {
    return new Promise((resolve) => {
      let radioArr = [];
      let i: number;
      let checked = false;
      for (i = 0; i < arr.length; i++) {
        if (i == 0) {
          checked = true;
        } else {
          checked = false;
        }
        radioArr.push({
          type: 'radio',
          label: arr[i].name,
          value: arr[i].value,
          checked: checked
        });
      };
      let alert = this.alertCtrl.create({
        title: title,
        inputs: radioArr,
        enableBackdropDismiss: false,
        buttons: [
          {
            text: btnText,
            handler: (data: string) => {
              resolve(data);
            }
          }
        ]
      });
      alert.present();
    });
  }

  showLoading(message): any {
    let loading = this.loadingCtrl.create({
      content: message,
      duration: 10000            // dismiss automatically after 10 seconds
    });
    loading.present();
    return loading;
  }

  hideLoading(loading) {
    loading.dismiss();
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

}
