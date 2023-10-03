import { registerWorker } from './helpers/service-worker.helper'

registerWorker()

interface Student {
  id: number
  email: string
  first_name: string
  last_name: string
  courses: string[]
  rating: number
}

const BASE_URL = 'https://learn-innodom.com/students'

const ENDPOINTS = {
  ALL_STUDENTS: '/all',
  CREATE_STUDENT: '/create',
  DELETE_STUDENT: '/delete',
  UPDATE_STUDENT: '/update'
}

const root = document.getElementById('root')!

const container = document.createElement('div')
container.classList.add('container')
container.style.marginTop = '20px'

root.append(container)

const addButton = document.createElement('div')

addButton.innerHTML = `<button type="button" class="btn btn-primary">Добавить студента</button>`

addButton.style.marginBottom = '20px'

container.append(addButton)

const removeButton = document.createElement('div')

removeButton.innerHTML = `<button id='removeButton' type="button" class="btn btn-primary test">Удалить студента(ов)</button>`

removeButton.style.marginBottom = '20px'

container.append(removeButton)

const formContainer = document.createElement('div')

formContainer.style.marginBottom = '20px'

formContainer.innerHTML = `
    <form>
      <div class="input-group input-group-sm mb-3">
        <input type="text" id="firstName" class="form-control" placeholder="Имя:" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
      </div>
      <div class="input-group input-group-sm mb-3">
        <input type="text" id="lastName" class="form-control" placeholder="Фамилия:" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
      </div>
      <div class="input-group input-group-sm mb-3">
        <input type="email" id="email" class="form-control" placeholder="Email:" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
      </div>
      <div class="input-group input-group-sm mb-3">
        <input type="text" id="courses" class="form-control" placeholder="Курсы (через запятую):" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
      </div>
      <div class="input-group input-group-sm mb-3">
        <input type="number" id="rating" class="form-control" placeholder="Рейтинг:" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
      </div>
      <button type="submit" class="btn btn-primary">Добавить</button>
    </form>
`

formContainer.style.display = 'none'

container.append(formContainer)

const studentForm = document.querySelector('form') as HTMLFormElement

const studentList = document.createElement('div')

studentList.style.display = 'flex'
studentList.style.flexWrap = 'wrap'
studentList.style.justifyContent = 'center'
studentList.style.gap = '20px'

container.append(studentList)

addButton.addEventListener('click', () => {
  formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none'
})

const checkRemoveButton = () => {
  const checkboxes = document.querySelectorAll('.student-checkbox')
  let hasCheckedCheckbox = false

  checkboxes.forEach((checkbox) => {
    const inputElement = checkbox as HTMLInputElement
    if (inputElement.checked) {
      hasCheckedCheckbox = true
      return
    }
  })

  if (hasCheckedCheckbox) {
    removeButton.style.display = 'block'
  } else {
    removeButton.style.display = 'none'
  }
}

const getStudents = async () => {
  try {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.ALL_STUDENTS}`)

    const responseData: { data: Student[] } = await response.json()

    studentList.innerHTML = ''

    responseData.data.forEach((student) => {
      const studentItem = document.createElement('div')
      studentItem.classList.add('card')
      studentItem.style.width = '18rem'
      studentItem.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${student.first_name} ${student.last_name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${student.email}</h6>
                <p class="card-text">Направления: ${student.courses.join(', ')}</p>
                <p class="card-text">Рэйтинг: ${student.rating}</p>
                <div>
                <input class="form-check-input student-checkbox" type="checkbox" value="" id=${
                  student.id
                }>
                Выбрать для удаления
                </div>
            </div>
        `

      const editButton = document.createElement('button')
      editButton.textContent = 'Редактировать'
      editButton.classList.add('btn', 'btn-primary', 'edit')
      editButton.addEventListener('click', () => {
        editStudent(student.id, student)
      })

      studentItem.append(editButton)
      studentList.append(studentItem)

      const checkboxes = document.querySelectorAll('.student-checkbox')
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', checkRemoveButton)
      })

      checkRemoveButton()
    })
  } catch (error) {
    root.innerHTML = `Произошла ошибка при загрузке студентов. ${error}`
  }
}

const addStudent = async (event: Event) => {
  event.preventDefault()

  const firstNameInput = document.getElementById('firstName') as HTMLInputElement
  const lastNameInput = document.getElementById('lastName') as HTMLInputElement
  const emailInput = document.getElementById('email') as HTMLInputElement
  const coursesInput = document.getElementById('courses') as HTMLInputElement
  const ratingInput = document.getElementById('rating') as HTMLInputElement

  const newStudentData = {
    first_name: firstNameInput.value,
    last_name: lastNameInput.value,
    email: emailInput.value,
    courses: coursesInput.value.split(',').map((course) => course.trim()),
    rating: Number(ratingInput.value)
  }

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.CREATE_STUDENT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newStudentData)
    })

    if (response.ok) {
      firstNameInput.value = ''
      lastNameInput.value = ''
      emailInput.value = ''
      coursesInput.value = ''
      ratingInput.value = ''

      formContainer.style.display = 'none'

      getStudents()
    }
  } catch (error) {
    root.innerHTML = `Произошла ошибка при загрузке студентов. ${error}`
  }
}

studentForm.addEventListener('submit', addStudent)

removeButton.addEventListener('click', async () => {
  const checkboxes = document.querySelectorAll('.student-checkbox')
  const studentsToDelete: string[] = []

  checkboxes.forEach((checkbox) => {
    const inputElement = checkbox as HTMLInputElement
    if (inputElement.checked) {
      const studentId = inputElement.id
      studentsToDelete.push(studentId)
    }
  })

  try {
    for (const studentId of studentsToDelete) {
      await fetch(`${BASE_URL}${ENDPOINTS.DELETE_STUDENT}${studentId}`, {
        method: 'DELETE'
      })
    }
    getStudents()
  } catch (error) {
    root.innerHTML = `Произошла ошибка при загрузке студентов. ${error}`
  }
})

const editStudent = (studentId: number, data: Student) => {
  const firstNameInput = document.getElementById('firstName') as HTMLInputElement
  const lastNameInput = document.getElementById('lastName') as HTMLInputElement
  const emailInput = document.getElementById('email') as HTMLInputElement
  const coursesInput = document.getElementById('courses') as HTMLInputElement
  const ratingInput = document.getElementById('rating') as HTMLInputElement

  firstNameInput.value = data.first_name
  lastNameInput.value = data.last_name
  emailInput.value = data.email
  coursesInput.value = data.courses.join(', ')
  ratingInput.value = data.rating.toString()

  formContainer.style.display = 'block'

  studentForm.removeEventListener('submit', addStudent)

  studentForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const updatedStudentData = {
      first_name: firstNameInput.value,
      last_name: lastNameInput.value,
      email: emailInput.value,
      courses: coursesInput.value.split(',').map((course) => course.trim()),
      rating: Number(ratingInput.value)
    }

    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.UPDATE_STUDENT}${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedStudentData)
      })

      if (response.ok) {
        firstNameInput.value = ''
        lastNameInput.value = ''
        emailInput.value = ''
        coursesInput.value = ''
        ratingInput.value = ''
        formContainer.style.display = 'none'
        getStudents()
      }
    } catch (error) {
      root.innerHTML = `Произошла ошибка при загрузке студентов. ${error}`
    }
  })
}
getStudents()
