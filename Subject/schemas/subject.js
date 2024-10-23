import z from 'zod';

const subjectSchema = z.object({
  name: z.string().min(2, { messag: "El nombre de la materia es requerido." }),
  course: z.string().min(2, { message: "El curso es requerido." })
});

const scheduleScheme = z.object({
  day: z.string().min(2, { message: "El dia es requerido." }),
  schedule: z.string().min(2, { message: "El horario es requerido." })
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