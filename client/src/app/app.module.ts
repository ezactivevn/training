import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from '@ionic/storage';
import { Stripe } from '@ionic-native/stripe';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { CourtBookingPage } from '../pages/court-booking/court-booking';
import { NewBookingPage } from '../pages/new-booking/new-booking';
import { PaymentPage } from '../pages/payment/payment';

import { TimePipe } from '../pipes/time';

import { ServerProvider } from '../providers/server';
import { PromptProvider } from '../providers/prompt';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegisterPage,
    LoginPage,
    ForgotPasswordPage,
    CourtBookingPage,
    NewBookingPage,
    PaymentPage,

    TimePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterPage,
    LoginPage,
    ForgotPasswordPage,
    CourtBookingPage,
    NewBookingPage,
    PaymentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Stripe,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServerProvider,
    PromptProvider
  ]
})
export class AppModule {}
