import { v4 } from 'uuid'
import { IStudent } from 'service_worker/interfaces/student'
import { students } from 'service_worker/constants/students'

class StudentService {
  students: IStudent[] = students

  getStudents() {
    return this.students
  }

  createStudent(data: Omit<IStudent, 'id'>) {
    const student = {
      id: v4(),
      ...data
    }
    this.students.push(student)
    return student
  }

  updateStudent(id: string, data: Omit<IStudent, 'id'>) {
    const index = this.students.findIndex((student) => student.id === id)
    const student = {
      ...this.students[index],
      ...data
    }
    this.students[index] = student
    return student
  }

  deleteStudent(id: string) {
    this.students = this.students.filter((student) => student.id !== id)
    return true
  }
}

export const studentService = new StudentService()
