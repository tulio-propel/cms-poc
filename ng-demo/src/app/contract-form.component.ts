import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StrapiService } from './strapi.service';
import { ContractData } from './models';

@Component({
  selector: 'app-contract-form',
  imports: [ReactiveFormsModule],
  template: `
    <div class="contract-form-container">
      <h2>Loan Agreement Generator</h2>
      
      <form [formGroup]="contractForm" (ngSubmit)="onSubmit()">
        <div class="form-section">
          <h3>Borrower Information</h3>
          <div class="form-field">
            <label for="fullName">Full Name:</label>
            <input id="fullName" type="text" formControlName="fullName" placeholder="Enter borrower's full name" />
            @if (contractForm.get('fullName')?.invalid && contractForm.get('fullName')?.touched) {
              <div class="error-message">Full name is required</div>
            }
          </div>
          <div class="form-field">
            <label for="address">Address:</label>
            <textarea id="address" formControlName="address" placeholder="Enter borrower's address" rows="3"></textarea>
            @if (contractForm.get('address')?.invalid && contractForm.get('address')?.touched) {
              <div class="error-message">Address is required</div>
            }
          </div>
        </div>

        <div class="form-section">
          <h3>Lender Information</h3>
          <div class="form-field">
            <label for="lenderName">Lender Name:</label>
            <input id="lenderName" type="text" formControlName="lenderName" placeholder="Enter lender name" />
          </div>
          <div class="form-field">
            <label for="lenderAddress">Lender Address:</label>
            <textarea id="lenderAddress" formControlName="lenderAddress" placeholder="Enter lender address" rows="3"></textarea>
          </div>
          <div class="form-field">
            <label for="lenderEmail">Support Email:</label>
            <input id="lenderEmail" type="email" formControlName="lenderEmail" placeholder="Enter support email" />
          </div>
        </div>
        
        <div class="form-section">
          <h3>Loan Details</h3>
          <div class="form-field">
            <label for="amount">Loan Amount:</label>
            <input id="amount" type="number" formControlName="amount" placeholder="Enter loan amount" />
            @if (contractForm.get('amount')?.invalid && contractForm.get('amount')?.touched) {
              <div class="error-message">Valid loan amount is required</div>
            }
          </div>
          <div class="form-field">
            <label for="currency">Currency:</label>
            <select id="currency" formControlName="currency">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="BRL">BRL</option>
            </select>
          </div>
          <div class="form-field">
            <label for="interestRateApr">Interest Rate (APR %):</label>
            <input id="interestRateApr" type="number" formControlName="interestRateApr" placeholder="Enter annual interest rate" step="0.01" />
            @if (contractForm.get('interestRateApr')?.invalid && contractForm.get('interestRateApr')?.touched) {
              <div class="error-message">Valid interest rate is required</div>
            }
          </div>
          <div class="form-field">
            <label for="termMonths">Term (Months):</label>
            <input id="termMonths" type="number" formControlName="termMonths" placeholder="Enter loan term in months" />
            @if (contractForm.get('termMonths')?.invalid && contractForm.get('termMonths')?.touched) {
              <div class="error-message">Valid term is required</div>
            }
          </div>
          <div class="form-field">
            <label for="repaymentFrequency">Repayment Frequency:</label>
            <input id="repaymentFrequency" type="text" formControlName="repaymentFrequency" placeholder="e.g. Monthly" />
          </div>
          <div class="form-field">
            <label for="paymentAmount">Payment Amount:</label>
            <input id="paymentAmount" type="number" formControlName="paymentAmount" placeholder="Periodic payment amount" step="0.01" />
          </div>
          <div class="form-field">
            <label for="firstPaymentDate">First Payment Date:</label>
            <input id="firstPaymentDate" type="date" formControlName="firstPaymentDate" />
          </div>
          <div class="form-field">
            <label for="disbursementDays">Disbursement (business days):</label>
            <input id="disbursementDays" type="number" formControlName="disbursementDays" placeholder="Days after signing" />
          </div>
          <div class="form-field">
            <label for="lateFeeCurrency">Late Fee Currency:</label>
            <select id="lateFeeCurrency" formControlName="lateFeeCurrency">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="BRL">BRL</option>
            </select>
          </div>
          <div class="form-field">
            <label for="lateFeeAmount">Late Fee Amount:</label>
            <input id="lateFeeAmount" type="number" formControlName="lateFeeAmount" placeholder="Late fee amount" step="0.01" />
          </div>
        </div>
        
        <div class="form-section">
          <h3>Contract Details</h3>
          <div class="form-field">
            <label for="effectiveDate">Effective Date:</label>
            <input id="effectiveDate" type="date" formControlName="effectiveDate" />
            @if (contractForm.get('effectiveDate')?.invalid && contractForm.get('effectiveDate')?.touched) {
              <div class="error-message">Effective date is required</div>
            }
          </div>
          <div class="form-field">
            <label for="governingLawRegion">Governing Law / Jurisdiction:</label>
            <input id="governingLawRegion" type="text" formControlName="governingLawRegion" placeholder="e.g. Ontario, Canada" />
          </div>
          <div class="form-field">
            <label for="contractNumber">Contract Number:</label>
            <input id="contractNumber" type="text" formControlName="contractNumber" placeholder="e.g. CN-000001" />
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" [disabled]="contractForm.invalid">
            Generate Contracts
          </button>
        </div>
      </form>
      
      @if (loading()) {
        <div class="loading">Loading contracts...</div>
      }
      
      @if (error()) {
        <div class="error">{{ error() }}</div>
      }
      
      <div class="contracts-container">
        @for (contract of contracts(); track contract.locale) {
          <div class="contract-preview">
            <h3>{{ contract.title }}</h3>
            <div class="contract-content" [innerHTML]="contract.html"></div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .contract-form-container { max-width: 900px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
    .form-section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; }
    .form-section h3 { margin-top: 0; color: #333; }
    .form-field { margin-bottom: 15px; }
    .form-field label { display: block; margin-bottom: 5px; font-weight: bold; color: #555; }
    .form-field input, .form-field textarea, .form-field select { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px; box-sizing: border-box; }
    .form-field textarea { resize: vertical; }
    .form-actions { text-align: center; margin: 30px 0; }
    button { padding: 12px 30px; background-color: #007bff; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; transition: background-color 0.3s; }
    button:hover:not(:disabled) { background-color: #0056b3; }
    button:disabled { background-color: #cccccc; cursor: not-allowed; }
    .loading, .error { padding: 15px; margin: 20px 0; border-radius: 4px; text-align: center; }
    .loading { background-color: #e9ecef; color: #6c757d; }
    .error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    .contracts-container { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px; }
    @media (max-width: 768px) { .contracts-container { grid-template-columns: 1fr; } }
    .contract-preview { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: white; }
    .contract-preview h3 { margin-top: 0; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .contract-content { line-height: 1.6; }
    .contract-content h2 { font-size: 18px; font-weight: 700; color: #1a1a2e; margin: 24px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #e0e0e0; }
    .contract-content h2:first-of-type { margin-top: 0; }
    .contract-content p { margin: 8px 0; color: #333; }
    .contract-content strong { font-weight: 600; color: #1a1a2e; }
    .error-message { color: #dc3545; font-size: 14px; margin-top: 5px; }
  `
})
export class ContractFormComponent {
  private fb = inject(FormBuilder);
  private strapiService = inject(StrapiService);
  
  loading = signal(false);
  error = signal('');

  contracts = signal<Array<{ locale: string; title: string; html: string }>>([]);
  
  contractForm = this.fb.group({
    fullName: ['John Doe', Validators.required],
    address: ['123 Main Street, New York, NY 10001', Validators.required],
    lenderName: ['Aurora Lending Inc.', Validators.required],
    lenderAddress: ['100 King St W, Toronto, ON M5X 1C9', Validators.required],
    lenderEmail: ['support@auroralending.example', [Validators.required, Validators.email]],
    amount: [50000, [Validators.required, Validators.min(1)]],
    currency: ['USD', Validators.required],
    interestRateApr: [5.5, [Validators.required, Validators.min(0)]],
    termMonths: [36, [Validators.required, Validators.min(1)]],
    repaymentFrequency: ['Monthly', Validators.required],
    paymentAmount: [1500, [Validators.required, Validators.min(1)]],
    firstPaymentDate: ['2026-08-01', Validators.required],
    disbursementDays: [3, [Validators.required, Validators.min(1)]],
    lateFeeCurrency: ['USD', Validators.required],
    lateFeeAmount: [25, [Validators.required, Validators.min(0)]],
    effectiveDate: ['2026-06-22', Validators.required],
    governingLawRegion: ['Ontario, Canada', Validators.required],
    contractNumber: ['CN-000001', Validators.required]
  });
  
  onSubmit() {
    if (this.contractForm.valid) {
      const formData = this.contractForm.value;
      
      const contractData: ContractData = {
        borrower: {
          fullName: formData.fullName!,
          address: formData.address!
        },
        lender: {
          name: formData.lenderName!,
          address: formData.lenderAddress!,
          supportEmail: formData.lenderEmail!
        },
        loan: {
          amount: formData.amount!,
          currency: formData.currency!,
          interestRateApr: formData.interestRateApr!,
          termMonths: formData.termMonths!,
          repaymentFrequency: formData.repaymentFrequency!,
          paymentAmount: formData.paymentAmount!,
          firstPaymentDate: formData.firstPaymentDate!,
          disbursementDays: formData.disbursementDays!,
          lateFeeCurrency: formData.lateFeeCurrency!,
          lateFeeAmount: formData.lateFeeAmount!
        },
        contract: {
          effectiveDate: formData.effectiveDate!,
          governingLawRegion: formData.governingLawRegion!,
          contractNumber: formData.contractNumber!
        }
      };
      
      this.generateContracts(contractData);
    }
  }
  
  private generateContracts(data: ContractData) {
    this.loading.set(true);
    this.error.set('');
    this.contracts.set([]);
    const seenLocales = new Set<string>();
    
    this.strapiService.getContractTemplates().subscribe({
      next: (defaultResponse) => {
        if (!defaultResponse.data?.length) {
          this.loading.set(false);
          return;
        }
        
        const baseEntry = defaultResponse.data[0];
        const localeCodes = this.collectLocaleCodes(baseEntry);
        
        this.addContract(baseEntry, data, seenLocales);
        
        if (localeCodes.length === 0) {
          this.contracts.set([...contractsSnapshot()]);
          this.loading.set(false);
          return;
        }
        
        let completed = 0;
        for (const locale of localeCodes) {
          this.strapiService.getContractTemplates(locale).subscribe({
            next: (response) => {
              if (response.data?.length) {
                this.addContract(response.data[0], data, seenLocales);
              }
              completed++;
              if (completed === localeCodes.length) {
                this.contracts.set([...contractsSnapshot()]);
                this.loading.set(false);
              }
            },
            error: () => {
              completed++;
              if (completed === localeCodes.length) {
                this.contracts.set([...contractsSnapshot()]);
                this.loading.set(false);
              }
            }
          });
        }
      },
      error: (err) => {
        this.error.set('Failed to load contract templates.');
        console.error('Error loading contracts:', err);
        this.loading.set(false);
      }
    });
    
    const contractsSnapshot = () => this.contracts();
  }

  private collectLocaleCodes(baseEntry: { locale: string; localizations?: Array<{ locale: string }> }): string[] {
    const codes = new Set<string>();
    
    if (baseEntry.localizations?.length) {
      for (const loc of baseEntry.localizations) {
        if (loc.locale && loc.locale !== baseEntry.locale) {
          codes.add(loc.locale);
        }
      }
    }
    
    if (codes.size === 0) {
      for (const fallback of ['pt-BR', 'es', 'fr', 'de']) {
        if (fallback !== baseEntry.locale) {
          codes.add(fallback);
        }
      }
    }
    
    return [...codes];
  }

  private addContract(
    template: { locale: string; sections: any[] },
    data: ContractData,
    seenLocales: Set<string>
  ): void {
    const locale = template.locale || 'en';
    if (seenLocales.has(locale)) return;
    seenLocales.add(locale);
    
    const result = this.renderContract(template.sections ?? [], data);
    const current = this.contracts();
    current.push({
      locale,
      title: `${this.localeDisplayName(locale)} Contract`,
      html: result.html
    });
    this.contracts.set(current);
  }

  private localeDisplayName(locale: string): string {
    const names: Record<string, string> = {
      en: 'English',
      'pt-BR': 'Portuguese',
      es: 'Spanish',
      fr: 'French',
      de: 'German'
    };
    return names[locale] || locale;
  }
  
  private renderContract(
    sections: Array<{ heading: string; body?: Array<{ type: string; children?: Array<{ text?: string; bold?: boolean }> }>; body_html?: string | null; body_markdown?: string | null }>,
    data: ContractData
  ): { plain: string; html: string; markdown: string } {
    let plain = '';
    let html = '';
    let markdown = '';
    
    for (const section of sections) {
      if (section.heading) {
        plain += `\n${section.heading.toUpperCase()}\n`;
        html += `<h2>${section.heading}</h2>`;
        markdown += `\n## ${section.heading}\n\n`;
      }
      
      if (section.body) {
        for (const block of section.body) {
          if (block.type === 'paragraph' && block.children) {
            const plainText = block.children.map(c => c.text ?? '').join('');
            if (plainText.trim()) {
              plain += this.replacePlaceholders(plainText, data) + '\n';
            }
          }
        }
      }
      
      if (section.body) {
        for (const block of section.body) {
          if (block.type === 'paragraph' && block.children) {
            const htmlContent = block.children.map(c => {
              const text = this.replacePlaceholders(c.text ?? '', data);
              return c.bold ? `<strong>${text}</strong>` : text;
            }).join('');
            if (htmlContent.trim()) {
              html += `<p>${htmlContent}</p>`;
            }
          }
        }
      } else if (section.body_html) {
        html += this.replacePlaceholders(section.body_html, data);
      }
      
      if (section.body) {
        for (const block of section.body) {
          if (block.type === 'paragraph' && block.children) {
            const mdContent = block.children.map(c => {
              const text = this.replacePlaceholders(c.text ?? '', data);
              return c.bold ? `**${text}**` : text;
            }).join('');
            if (mdContent.trim()) {
              markdown += mdContent + '\n\n';
            }
          }
        }
      }
    }
    
    return { plain, html, markdown };
  }
  
  private replacePlaceholders(text: string, data: ContractData): string {
    return text
      .replace(/{{borrower\.fullName}}/g, data.borrower.fullName)
      .replace(/{{borrower\.address}}/g, data.borrower.address)
      .replace(/{{lender\.name}}/g, data.lender.name)
      .replace(/{{lender\.address}}/g, data.lender.address)
      .replace(/{{lender\.supportEmail}}/g, data.lender.supportEmail)
      .replace(/{{loan\.amount}}/g, data.loan.amount.toString())
      .replace(/{{loan\.currency}}/g, data.loan.currency)
      .replace(/{{loan\.interestRateApr}}/g, data.loan.interestRateApr.toString())
      .replace(/{{loan\.termMonths}}/g, data.loan.termMonths.toString())
      .replace(/{{loan\.repaymentFrequency}}/g, data.loan.repaymentFrequency)
      .replace(/{{loan\.paymentAmount}}/g, data.loan.paymentAmount.toString())
      .replace(/{{loan\.firstPaymentDate}}/g, data.loan.firstPaymentDate)
      .replace(/{{loan\.disbursementDays}}/g, data.loan.disbursementDays.toString())
      .replace(/{{loan\.lateFeeCurrency}}/g, data.loan.lateFeeCurrency)
      .replace(/{{loan\.lateFeeAmount}}/g, data.loan.lateFeeAmount.toString())
      .replace(/{{contract\.effectiveDate}}/g, data.contract.effectiveDate)
      .replace(/{{contract\.governingLawRegion}}/g, data.contract.governingLawRegion)
      .replace(/{{contract\.contractNumber}}/g, data.contract.contractNumber);
  }
}