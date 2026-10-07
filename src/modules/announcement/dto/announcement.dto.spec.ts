import {
  CreateAnnouncementDto,
  CreateAnnouncementSchema,
  UpdateAnnouncementSchema,
} from './announcement.dto';

describe('AnnouncementDto', () => {
  const validData = {
    type: 'INFO' as const,
    text: 'Aviso de teste no sistema',
    ctaText: 'Ver mais',
    ctaLink: 'https://exemplo.com/detalhes',
    active: true,
  };

  describe('CreateAnnouncementSchema', () => {
    it('should validate valid announcement payload', () => {
      const result = CreateAnnouncementSchema.parse(validData);
      expect(result.text).toBe(validData.text);
      expect(result.ctaText).toBe(validData.ctaText);
      expect(result.ctaLink).toBe(validData.ctaLink);
    });

    it('should accept ctaText with exactly 50 characters', () => {
      const ctaText50 = 'a'.repeat(50);
      expect(() =>
        CreateAnnouncementSchema.parse({
          ...validData,
          ctaText: ctaText50,
        }),
      ).not.toThrow();
    });

    it('should reject ctaText longer than 50 characters', () => {
      const ctaText51 = 'a'.repeat(51);
      expect(() =>
        CreateAnnouncementSchema.parse({
          ...validData,
          ctaText: ctaText51,
        }),
      ).toThrow();
    });

    it('should accept ctaLink with exactly 255 characters', () => {
      const ctaLink255 = 'https://' + 'a'.repeat(247);
      expect(ctaLink255.length).toBe(255);
      expect(() =>
        CreateAnnouncementSchema.parse({
          ...validData,
          ctaLink: ctaLink255,
        }),
      ).not.toThrow();
    });

    it('should reject ctaLink longer than 255 characters', () => {
      const ctaLink256 = 'https://' + 'a'.repeat(248);
      expect(ctaLink256.length).toBe(256);
      expect(() =>
        CreateAnnouncementSchema.parse({
          ...validData,
          ctaLink: ctaLink256,
        }),
      ).toThrow();
    });

    it('should allow nullable or undefined ctaText and ctaLink', () => {
      const result = CreateAnnouncementSchema.parse({
        text: 'Aviso sem CTA',
        ctaText: null,
        ctaLink: null,
      });
      expect(result.ctaText).toBeNull();
      expect(result.ctaLink).toBeNull();
    });
  });

  describe('UpdateAnnouncementSchema', () => {
    it('should accept partial payloads with bounded ctaText', () => {
      expect(() =>
        UpdateAnnouncementSchema.parse({
          ctaText: 'Novo CTA',
        }),
      ).not.toThrow();
    });

    it('should reject partial payload with ctaText > 50 characters', () => {
      expect(() =>
        UpdateAnnouncementSchema.parse({
          ctaText: 'x'.repeat(51),
        }),
      ).toThrow();
    });
  });

  describe('CreateAnnouncementDto class', () => {
    it('should define static schema property', () => {
      expect(CreateAnnouncementDto.schema).toBe(CreateAnnouncementSchema);
    });
  });
});
