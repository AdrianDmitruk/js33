import { ObjectSchema, array, number, object, string } from 'yup'
import { IStudent } from 'service_worker/interfaces/student'

export const StudentSchema: ObjectSchema<Omit<IStudent, 'id'>> = object({
  email: string()
    .email()
    .required(),
  first_name: string().required(),
  last_name: string().required(),
  courses: array(string().required()).required(),
  rating: number().required()
})
