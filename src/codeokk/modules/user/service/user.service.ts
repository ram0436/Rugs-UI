import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private dataSubject = new Subject<any>();

  private baseUrl = environment.baseUrl;

  private userDataKey = "userData";

  constructor(private httpClient: HttpClient) {}

  setUserData(data: { name: string; mobile: string }) {
    localStorage.setItem(this.userDataKey, JSON.stringify(data));
  }

  getUserData() {
    const userDataString = localStorage.getItem(this.userDataKey);
    if (userDataString) {
      return JSON.parse(userDataString);
    }
    return null;
  }

  getAddress(pinCode: any) {
    return this.httpClient.get(
      "https://api.postalpincode.in/pincode/" + pinCode
    );
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  sendLoginOTP(
    mobileNumber: string,
    ipAddress: string,
    createdOn: string
  ): Observable<any> {
    const url = `${this.baseUrl}Auth/SendLoginOTP`;
    const body = {
      mobile: mobileNumber,
      ipAddress: ipAddress,
      createdOn: createdOn,
    };
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.httpClient.post(url, body, { headers: headers });
  }

  OTPLogin(mobileNo: string, otp: number, firstName: string): Observable<any> {
    const url = `${this.baseUrl}Auth/OTPLogin?mobileNo=${mobileNo}&otp=${otp}&firstName=${firstName}`;
    return this.httpClient.post(url, null, {
      headers: new HttpHeaders({
        Accept: "*/*",
      }),
    });
  }
}
