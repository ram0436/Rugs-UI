import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MasterService {
  private dataSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  private baseUrl = environment.baseUrl;

  setData(data: any) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }

  getAllColor() {
    return this.http.get(`${this.baseUrl}/Master/GetAllColor`);
  }

  getAllDiscount() {
    return this.http.get(`${this.baseUrl}/Master/GetAllDiscount`);
  }

  getAllProductSize() {
    return this.http.get(`${this.baseUrl}/Master/GetAllProductSize`);
  }

  getAllMaterial() {
    return this.http.get(`${this.baseUrl}/Master/GetAllMaterial`);
  }

  getAllShape() {
    return this.http.get(`${this.baseUrl}/Master/GetAllShape`);
  }

  getAllWeavingTechnique() {
    return this.http.get(`${this.baseUrl}/Master/GetAllWeavingTechnique`);
  }

  getAllCollection() {
    return this.http.get(`${this.baseUrl}/Master/GetAllCollection`);
  }

  getAllPattern() {
    return this.http.get(`${this.baseUrl}/Master/GetAllPattern`);
  }

  getAllRoom() {
    return this.http.get(`${this.baseUrl}/Master/GetAllRoom`);
  }

  getAllPriceRange() {
    return this.http.get(`${this.baseUrl}/Master/GetAllPriceRange`);
  }
}
