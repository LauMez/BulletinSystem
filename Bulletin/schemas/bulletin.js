import z from 'zod';

const bulletinSchema = z.object({
  observations: z.string({
    invalid_type_error: 'Period observations must be a string',
    required_error: 'Period observations is required'
  })
});

const assessmentScheme = z.object({
  qualification: z.string({
    invalid_type_error: 'Assessment qualification must be a string',
    required_error: 'Assessment qualification is required'
  }),
  assessment_type: z.string({
    invalid_type_error: 'Assessment type must be a string',
    required_error: 'Assessment type is required'
  })
});

const assessmentPartialScheme = z.object({
  qualification: z.string({
    invalid_type_error: 'Assessment qualification must be a string',
    required_error: 'Assessment qualification is required'
  })
});

export function validateAssessment (input) {
  return assessmentScheme.safeParse(input);
};

export function validatePartialAssessment (input) {
  return assessmentPartialScheme.partial().safeParse(input);
};

export function validatePartialPeriod (input) {
  return bulletinSchema.partial().safeParse(input);
};