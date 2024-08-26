import z from 'zod';

const dniValidation = (dni, cuil) => {
  const cuilToDni = cuil.slice(2, -1);
  return dni === cuilToDni;
};

const studentScheme = z.object({
  CUIL: z.string({
    invalid_type_error: 'CUIL must be a string',
    required_error: 'CUIL is required'
  }),
  blood_type: z.string({
    invalid_type_error: 'blood type must be a string',
    required_error: 'Blood type is required'
  }),
  social_work: z.string({
    invalid_type_error: 'Social work must be a string',
    required_error: 'Social work is required'
  }),
  first_name: z.string({
  invalid_type_error: 'First name must be a string',
    required_error: 'First name is required'
  }),
  second_name: z.string({
    invalid_type_error: 'Second name must be a string'
  }),
  last_name1: z.string({
    invalid_type_error: 'First last name must be a string',
    required_error: 'First last name is required'
  }),
  last_name2: z.string({
    invalid_type_error: 'Second last name must be a string'
  }),
  phone_number: z.string({
    invalid_type_error: 'Phone number must be a string',
    required_error: 'Phone number is required'
  }),
  landline_phone_number: z.string({
    invalid_type_error: 'Landline phone number must be a string'
  }),
  direction: z.string({
    invalid_type_error: 'Direction must be a string',
    required_error: 'Direction is required'
  })
});

const accountScheme = z.object({
  DNI: z.string({
    invalid_type_error: 'DNI must be a string',
    required_error: 'DNI is required'
  }),
  password: z.string({
    invalid_type_error: 'Password must be a string',
    required_error: 'Password is required'
  })
})

export function validateStudent (input) {
  return studentScheme.safeParse(input);
};

export function validatePartialStudent (input) {
  return studentScheme.partial().safeParse(input);
};

export function validatePartialAccount (input, CUIL) {
  return accountScheme.partial().refine((data) => {
    if (!dniValidation(data.DNI, CUIL)) {
      return false;
    }
    return true;
  }).safeParse(input);
};
