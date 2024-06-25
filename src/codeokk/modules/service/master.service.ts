import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MasterService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.baseUrl;

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
