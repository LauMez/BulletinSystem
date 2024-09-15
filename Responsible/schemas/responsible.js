import z from 'zod';

const dniValidation = (dni, cuil) => {
  const cuilToDni = cuil.slice(2, -1);
  return dni === cuilToDni;
};

const responsibleScheme = z.object({
  CUIL: z.string()
        .length(11, { message: 'El CUIL debe tener exactamente 11 caracteres.'} )
        .regex(/^\d+$/, { message: "El CUIL debe contener solo números." }),
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
  student: z.string().min(2, { message: "El estudiante es requerido." })
});

const responsiblePartialScheme = z.object({
  phone_number: z.string()
            .min(2, { message: 'El campo Numero de Teléfono es requerido.'} )
            .regex(/^\d+$/, { message: "El número de teléfono debe contener solo números." }),
  landline_phone_number: z.string().optional(),
  direction: z.string()
          .min(2, { message: 'La Dirección es requerida.'} )
})


export function validateResponsible (input) {
  return responsibleScheme.safeParse(input);
};

export function validatePartialResponsible (input) {
  return responsiblePartialScheme.partial().safeParse(input);
};