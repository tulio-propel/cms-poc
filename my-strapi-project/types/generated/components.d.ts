import type { Schema, Struct } from '@strapi/strapi';

export interface ContractSection extends Struct.ComponentSchema {
  collectionName: 'components_contract_sections';
  info: {
    description: 'Purpose: represent each contract clause/section.';
    displayName: 'Section';
  };
  attributes: {
    body: Schema.Attribute.Blocks & Schema.Attribute.Required;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface SharedContractSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_contract_sections';
  info: {
    displayName: 'Contract Section';
  };
  attributes: {
    body: Schema.Attribute.Blocks;
    heading: Schema.Attribute.String;
  };
}

export interface SharedParty extends Struct.ComponentSchema {
  collectionName: 'components_shared_parties';
  info: {
    displayName: 'Party';
  };
  attributes: {
    address: Schema.Attribute.Text;
    email: Schema.Attribute.Email;
    name: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'contract.section': ContractSection;
      'shared.contract-section': SharedContractSection;
      'shared.party': SharedParty;
    }
  }
}
