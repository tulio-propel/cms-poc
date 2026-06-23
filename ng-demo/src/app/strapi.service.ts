import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Section {
  id: number;
  order: number;
  heading: string;
  body: any;
}

export interface ContractTemplate {
  id: number;
  documentId?: string;
  title: string;
  version: string;
  sections: Section[];
  locale: string;
  localizations?: Array<{ id: number; locale: string }>;
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

  getContractTemplates(locale?: string): Observable<StrapiResponse> {
    const url = `${this.apiUrl}/contract-templates`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.strapiApiKey}`
    });

    const params: Record<string, string> = { populate: 'sections' };
    if (locale) {
      params['locale'] = locale;
    }

    return this.http.get<StrapiResponse>(url, { headers, params });
  }
}
