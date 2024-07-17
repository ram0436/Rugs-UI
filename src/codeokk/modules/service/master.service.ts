import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MasterService {
  private dataSubject = new Subject<any>();

  private colorsSubject = new BehaviorSubject<any[]>([]);
  private sizesSubject = new BehaviorSubject<any[]>([]);
  private discountsSubject = new BehaviorSubject<any[]>([]);
  private materialsSubject = new BehaviorSubject<any[]>([]);
  private collectionsSubject = new BehaviorSubject<any[]>([]);
  private shapesSubject = new BehaviorSubject<any[]>([]);
  private patternsSubject = new BehaviorSubject<any[]>([]);
  private priceRangesSubject = new BehaviorSubject<any[]>([]);
  private roomsSubject = new BehaviorSubject<any[]>([]);
  private weavingTechniquesSubject = new BehaviorSubject<any[]>([]);

  colors$ = this.colorsSubject.asObservable();
  sizes$ = this.sizesSubject.asObservable();
  discounts$ = this.discountsSubject.asObservable();
  materials$ = this.materialsSubject.asObservable();
  collections$ = this.collectionsSubject.asObservable();
  shapes$ = this.shapesSubject.asObservable();
  patterns$ = this.patternsSubject.asObservable();
  priceRanges$ = this.priceRangesSubject.asObservable();
  rooms$ = this.roomsSubject.asObservable();
  weavingTechniques$ = this.weavingTechniquesSubject.asObservable();

  constructor(private http: HttpClient) {}

  private baseUrl = environment.baseUrl;

  fetchData() {
    forkJoin({
      colors: this.getAllColor(),
      sizes: this.getAllProductSize(),
      discounts: this.getAllDiscount(),
      materials: this.getAllMaterial(),
      collections: this.getAllCollection(),
      shapes: this.getAllShape(),
      patterns: this.getAllPattern(),
      priceRanges: this.getAllPriceRange(),
      rooms: this.getAllRoom(),
      weavingTechniques: this.getAllWeavingTechnique(),
    }).subscribe((data: any) => {
      this.colorsSubject.next(data.colors);
      this.sizesSubject.next(data.sizes);
      this.discountsSubject.next(data.discounts);
      this.materialsSubject.next(data.materials);
      this.collectionsSubject.next(data.collections);
      this.shapesSubject.next(data.shapes);
      this.patternsSubject.next(data.patterns);
      this.priceRangesSubject.next(data.priceRanges);
      this.roomsSubject.next(data.rooms);
      this.weavingTechniquesSubject.next(data.weavingTechniques);
    });
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }

  getAllColor(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Master/GetAllColor`);
  }

  getAllDiscount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Master/GetAllDiscount`);
  }

  getAllProductSize(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Master/GetAllProductSize`);
  }

  getAllMaterial(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Master/GetAllMaterial`);
  }

  getAllShape(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Master/GetAllShape`);
  }

  getAllWeavingTechnique(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Master/GetAllWeavingTechnique`);
  }

  getAllCollection(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Master/GetAllCollection`);
  }

  getAllPattern(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Master/GetAllPattern`);
  }

  getAllRoom(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Master/GetAllRoom`);
  }

  getAllPriceRange(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Master/GetAllPriceRange`);
  }
}
