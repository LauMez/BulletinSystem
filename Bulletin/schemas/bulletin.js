import z from 'zod';

const subjectSchema = z.object({
  name: z.string({
    invalid_type_error: 'Subject name must be a string',
    required_error: 'Subject name is required'
  }),
});

const scheduleScheme = z.object({
  day: z.string({
    invalid_type_error: 'Schedule day must be a string',
    required_error: 'Schedule day name is required'
  }),
  schedule: z.string({
    invalid_type_error: 'Schedule must be a string',
    required_error: 'Schedule is required'
  })
});
export function validateSchedule (input) {
  return scheduleScheme.safeParse(input);
};

export function validatePartialSchedule (input) {
  return scheduleScheme.partial().safeParse(input);
};

export function validateSubject (input) {
  return subjectSchema.safeParse(input);
};

export function validatePartialSubject (input) {
  return subjectSchema.partial().safeParse(input);
};