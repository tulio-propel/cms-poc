import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

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

export interface StrapiResponse {
  data: ContractTemplate[];
  meta: any;
}

@Injectable({
  providedIn: 'root'
})
export class StrapiService {
  private apiUrl = 'http://localhost:1337/api';

  constructor(private http: HttpClient) {}

  getContractTemplate(templateKey: string, locale: string): Observable<StrapiResponse> {
    const url = `${this.apiUrl}/contract-templates`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.strapiApiKey}`
    });

    return this.http.get<StrapiResponse>(url, {
      headers: headers,
      params: {
        'filters[key][$eq]': templateKey,
        'locale': locale,
        'populate': '*'
      }
    });
  }
}
