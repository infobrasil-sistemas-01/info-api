import {
  CreateProposalSchema,
  CreateProposalItemSchema,
} from './create-proposal.dto';
import { UpdateProposalSchema } from './update-proposal.dto';
import { ProposalQuerySchema } from './proposal-query.dto';

describe('Proposal DTO Schemas', () => {
  const validItem = {
    PRO_CODIGO: '00000000000045',
    IPR_QTDE: 2,
    IPR_PRECO: 50,
  };

  const validProposal = {
    FUN_CODIGO: 2,
    SIT_CODIGO: 1,
    CLI_CODIGO: 10,
    ITENS: [validItem],
  };

  describe('CreateProposalSchema', () => {
    test.each([
      ['minimal valid proposal', validProposal],
      [
        'full proposal with optional fields',
        {
          ...validProposal,
          LOJ_CODIGO: 1,
          PRO_ATENCIOSAMENTE: 'Sr. João',
          PRO_PRAZO: '10 DIAS',
          PRO_VALIDADE: '15 DIAS',
          PRO_DATA: '2026-11-25',
          PRO_HORA: '14:30:00',
          PRO_OBS: 'Observação teste',
          PRO_PRECO: '2',
          PRO_STATUS: '2',
        },
      ],
    ])('should accept %s', (_, input) => {
      expect(() => CreateProposalSchema.parse(input)).not.toThrow();
    });

    test.each([
      ['missing FUN_CODIGO', { ...validProposal, FUN_CODIGO: undefined }],
      ['missing SIT_CODIGO', { ...validProposal, SIT_CODIGO: undefined }],
      ['missing CLI_CODIGO', { ...validProposal, CLI_CODIGO: undefined }],
      ['empty ITENS', { ...validProposal, ITENS: [] }],
      ['invalid PRO_DATA format', { ...validProposal, PRO_DATA: '25/11/2026' }],
      [
        'non-positive IPR_QTDE',
        { ...validProposal, ITENS: [{ ...validItem, IPR_QTDE: 0 }] },
      ],
    ])('should reject %s', (_, input) => {
      expect(() => CreateProposalSchema.parse(input)).toThrow();
    });
  });

  describe('CreateProposalItemSchema', () => {
    test.each([
      ['valid item with price', validItem],
      ['valid item without price (server lookup)', { PRO_CODIGO: '1', IPR_QTDE: 1.5 }],
    ])('should accept %s', (_, input) => {
      expect(() => CreateProposalItemSchema.parse(input)).not.toThrow();
    });
  });

  describe('UpdateProposalSchema', () => {
    test.each([
      ['partial header update', { PRO_OBS: 'Atualizada', SIT_CODIGO: 2 }],
      ['items-only replacement', { ITENS: [validItem] }],
    ])('should accept %s', (_, input) => {
      expect(() => UpdateProposalSchema.parse(input)).not.toThrow();
    });
  });

  describe('ProposalQuerySchema', () => {
    test.each([
      ['empty query', {}],
      [
        'all filters',
        {
          page: '1',
          pageSize: '20',
          storeId: '1',
          statusId: '1',
          clientId: '10',
          sellerId: '2',
          proposalNumber: '105',
          proGerada: 'N',
          startDate: '2026-11-01',
          endDate: '2026-11-30',
        },
      ],
    ])('should accept %s', (_, input) => {
      expect(() => ProposalQuerySchema.parse(input)).not.toThrow();
    });

    test.each([
      ['invalid proGerada', { proGerada: 'X' }],
      ['invalid startDate', { startDate: '01-11-2026' }],
    ])('should reject %s', (_, input) => {
      expect(() => ProposalQuerySchema.parse(input)).toThrow();
    });
  });
});
