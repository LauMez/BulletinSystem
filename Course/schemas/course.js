import z from 'zod';

const courseSchema = z.object({
  year: z.number().min(2, { message: "El año es requerido." }),
  division: z.number().min(1, { message: "La division es requerida." }),
  entry_time: z.string().min(2, { message: "El turno es requerido." }),
  specialty: z.string().min(2, { message: "La especialidad es requerida." }).optional()
  }).refine(data => {
    return data.year < 4 || (data.specialty && data.specialty.trim() !== '');
  }, {
    message: "La especialidad es requerida si el año es mayor o igual a 4.",
    path: ["specialty"],
  }
);

const courseGroupScheme = z.object({
  group: z.string().min(2, { message: "El grupo es requerido." })
});

export function validateGroup (input) {
  return courseGroupScheme.safeParse(input);
};

export function validatePartialGroup (input) {
  return courseGroupScheme.partial().safeParse(input);
};

export function validateCourse (input) {
  return courseSchema.safeParse(input);
};

export function validatePartialCourse (input) {
  return courseSchema.partial().safeParse(input);
};
