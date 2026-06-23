export interface Borrower {
  fullName: string;
  address: string;
}

export interface Lender {
  name: string;
  address: string;
  supportEmail: string;
}

export interface Loan {
  amount: number;
  currency: string;
  interestRateApr: number;
  termMonths: number;
  repaymentFrequency: string;
  paymentAmount: number;
  firstPaymentDate: string;
  disbursementDays: number;
  lateFeeCurrency: string;
  lateFeeAmount: number;
}

export interface Contract {
  effectiveDate: string;
  governingLawRegion: string;
  contractNumber: string;
}

export interface ContractData {
  borrower: Borrower;
  lender: Lender;
  loan: Loan;
  contract: Contract;
}