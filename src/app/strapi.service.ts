import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Section {
  id: number;
  order: number;
  heading: string;
  body: any; // This would be the blocks content
}

export interface ContractTemplate {
  id: number;
  key: string;
  title: string;
  version: string;
  effectiveFrom: string;
  effectiveTo: string;
  description: string;
  sections: Section[];
  placeholders: any;
  locale: string;
}

@Injectable({
  providedIn: 'root'
})
export class StrapiService {
  private apiUrl = 'http://localhost:1337/api';

  constructor(private http: HttpClient) {}

  getContractTemplate(key: string, locale: string): Observable<{ data: ContractTemplate }> {
    const url = `${this.apiUrl}/contract-templates`;
    return this.http.get<{ data: ContractTemplate }>(url, {
      params: {
        'filters[key][$eq]': key,
        'locale': locale,
        'populate': 'sections'
      }
    });
  }
}