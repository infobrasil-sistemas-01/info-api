import { SendNewsletterDto, SendNewsletterSchema } from './send-newsletter.dto';

describe('SendNewsletterDto', () => {
  const validData = {
    announcementIds: ['e9868725-b883-4a11-8515-3850ba03ea42'],
    subject: 'Aviso importante sobre nova versão',
    initialMessage: 'Olá pessoal, confira as novidades!',
    finalMessage: 'Atenciosamente, equipe.',
    type: 'STANDARD' as const,
  };

  it('should validate valid payload successfully', () => {
    const result = SendNewsletterSchema.parse(validData);
    expect(result.subject).toBe(validData.subject);
  });

  it('should accept subject with exactly 255 characters', () => {
    const subject255 = 'a'.repeat(255);
    expect(() =>
      SendNewsletterSchema.parse({
        ...validData,
        subject: subject255,
      }),
    ).not.toThrow();
  });

  it('should reject subject with more than 255 characters', () => {
    const subject256 = 'a'.repeat(256);
    expect(() =>
      SendNewsletterSchema.parse({
        ...validData,
        subject: subject256,
      }),
    ).toThrow();
  });

  it('should reject subject with less than 3 characters', () => {
    expect(() =>
      SendNewsletterSchema.parse({
        ...validData,
        subject: 'ab',
      }),
    ).toThrow();
  });

  it('should have static schema property on SendNewsletterDto class', () => {
    expect(SendNewsletterDto.schema).toBe(SendNewsletterSchema);
  });
});
