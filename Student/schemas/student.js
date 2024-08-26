import z from 'zod';

const dniValidation = (dni, cuil) => {
  const cuilToDni = cuil.slice(2, -1);
  return dni === cuilToDni;
};

const studentScheme = z.object({
  CUIL: z.string()
        .length(11, { message: 'El CUIL debe tener exactamente 11 caracteres.'} )
        .regex(/^\d+$/, { message: "El CUIL debe contener solo números." }),
  blood_type: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], { message: "El grupo sanguíneo seleccionado no es válido." }),
  social_work: z.string()
                .min(2, { message: 'La obra social es requerida.'} ),
  first_name: z.string()
              .min(2, { message: 'El nombre es requerido.'} ),
  second_name: z.string()
                .optional(),
  last_name1: z.string()
                .min(2, { message: 'El apellido es requerido.'} ),
  last_name2: z.string()
              .optional(),
  phone_number: z.string()
                .min(2, { message: 'El campo Numero de Teléfono es requerido.'} )
                .regex(/^\d+$/, { message: "El número de teléfono debe contener solo números." }),
  landline_phone_number: z.string().optional(),
  direction: z.string()
              .min(2, { message: 'La Dirección es requerida.'} ),
  course: z.string().min(2, { message: 'El curso es requerido.' })
});

const studentPartialScheme = z.object({
  social_work: z.string()
            .min(2, { message: 'La obra social es requerida.'} ),
  phone_number: z.string()
            .min(2, { message: 'El campo Numero de Teléfono es requerido.'} )
            .regex(/^\d+$/, { message: "El número de teléfono debe contener solo números." }),
  landline_phone_number: z.string().optional(),
  direction: z.string()
          .min(2, { message: 'La Dirección es requerida.'} )
})


export function validateStudent (input) {
  return studentScheme.safeParse(input);
};

export function validatePartialStudent (input) {
  return studentPartialScheme.partial().safeParse(input);
};
