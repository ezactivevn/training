import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PromptProvider } from './prompt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ServerProvider {

  constructor(public http: HttpClient, public prompt: PromptProvider) {
  }

  post(url: string, para?: {}, opts?: {}): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      console.log('OPTS, opts = ', opts);
      let okMessage = '';
      let errorMessage = '';
      let showLoading = false;
      let testMode = false;
      let debugMode = false;
      if (opts) {
        if (opts['okMessage']) okMessage = opts['okMessage'];
        if (opts['errorMessage']) errorMessage = opts['errorMessage'];
        if (opts['showLoading']) showLoading = true;
        if (opts['testMode'] && opts['testMode'] == true) testMode = true;
        if (opts['debugMode'] && opts['debugMode'] == true) debugMode = true;
      }
      if (!para)
        para = {};
      para = this.convertParams(url, para);

      let params = new HttpParams();
      for (let key in para) {
        let value: any = para[key];
        if (!(typeof value === 'string'))
          value = JSON.stringify(value);
        params = params.append(key, value);
      }
      if (testMode)
        params = params.append('test', 'true');
      console.log('PARAMS, params = ', params);
      let options = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }) };
      let loading: any;
      if (showLoading)
        loading = this.prompt.showLoading("Loading...");

      if (debugMode) {
        this.prompt.showLogMessage('DEV', 'Server.post - SERVER URL = ', url);
        this.prompt.showLogMessage('DEV', 'Server.post - SERVER PARAMS = ', params);
      }

      console.log('BEFORE POST = ', params);

      this.http.post(url, params, options).toPromise()
        .then((response: any) => {
          if (showLoading)
            this.prompt.hideLoading(loading);

          if (debugMode)
            this.prompt.showLogMessage('DEV', 'Server.post - SERVER RESPONSE = ', response);

          if (response.status == 'OK') {
            if (okMessage != '') {
              this.prompt.showOKAlert(okMessage, response.message).then((res: boolean) => {
                resolve(response);
              });
            } else {
              response = this.convertResponse(url, response);
              resolve(response);
            }
          } else {
            this.prompt.showOKAlert(errorMessage, response.message).then((res: boolean) => {
              reject(response.message);
            });
          }
        })
        .catch(err => {
          if (showLoading)
            this.prompt.hideLoading(loading);
          this.prompt.showOKAlert('ERROR', err.message).then((res: boolean) => {
            reject(err.error);
          });
        });
    });
    return promise;
  }

  getLocalTextFile(url: string): Promise<any> {
    return new Promise(resolve => {
      this.http.get(url, { responseType: 'text' }).subscribe(data => {
        resolve(data);
      });
    });
  }

  // adjust parameters to match server before POST
  private convertParams(url: string, para: any) {
    return para;
  }

  // adjust response to match client before SEND BACK
  private convertResponse(url: string, response: any): any {
    return response;
  }

}
