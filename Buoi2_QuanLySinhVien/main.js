class Student {
  constructor(id, code, name, clas, gender, birth, born) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.clas = clas;
    this.gender = gender;
    this.birth = birth;
    this.born = born;
  }
}

class StudentManager {
  constructor() {
    this.students = JSON.parse(localStorage.getItem("students")) || [];
  }

  addStudent(student) {
    this.students.push(student);
    this.save();
  }

  getAllStudent() {
    return this.students;
  }

  getStudentById(id) {
    return this.students.find((student) => student.id === id);
  }

  updateStudent(data) {
    const indexStudent = this.students.findIndex(
      (student) => student.id == data.id
    );
    this.students[indexStudent] = data;
    this.save();
  }

  deleteStudent(id) {
    this.students = this.students.filter((student) => student.id !== id);
    this.save();
  }

  save() {
    localStorage.setItem("students", JSON.stringify(this.students));
  }
}

const Manager = new StudentManager();

function displayStudents() {
  const students = Manager.getAllStudent();
  const body = document.querySelector("table tbody");
  if (students.length == 0) {
    document.getElementById("mess").innerText = "Không có dữ liệu";
  }
  let data = "";
  students.map((student, index) => {
    const { code, name, clas, gender, birth, born } = student;
    data += `
        <tr>
          <td>${index + 1}</td>
          <td>${code}</td>
          <td>${name}</td>
          <td>${clas}</td>
          <td>${gender}</td>
          <td>${birth}</td>
          <td>${born}</td>
          <td>
            <button class="action-btn edit-btn" onclick="editStudent('${
              student.id
            }')">Sửa</button>
            <button class="action-btn delete-btn" onclick="deleteStudent('${
              student.id
            }')">Xóa</button>
          </td>
        </tr>
      `;
  });
  body.innerHTML = data;
}

function AddStudent() {
  const id = document.getElementById("id").value || Date.now().toString();
  const code = document.getElementById("code").value;
  const name = document.getElementById("name").value;
  const clas = document.getElementById("clas").value;
  const genderInput = document.querySelectorAll(
    'input[type="radio"][name="gender"]'
  );
  const birth = document.getElementById("birth").value;
  const born = document.getElementById("born").value;
  
  let gender = "";
  genderInput.forEach((item) => {
    if (item.checked) {
      gender = item.value;
    }
  });

  const student = new Student(id, code, name, clas, gender, birth, born);

  if (document.getElementById("id").value) {
    Manager.updateStudent(student);
  } else {
    Manager.addStudent(student);
  }

  displayStudents();
  clear();
}

function editStudent(id) {
  const student = Manager.getStudentById(id);
  document.getElementById("id").value = student.id;
  document.getElementById("code").value = student.code;
  document.getElementById("name").value = student.name;
  document.getElementById("clas").value = student.clas;
  document.getElementById("gender").value = student.gender;
  document.getElementById("birth").value = student.birth;
  document.getElementById("born").value = student.born;

  document.getElementById("submitStudent").innerText = "Cập nhật";
}

function deleteStudent(id) {
  Manager.deleteStudent(id);
  displayStudents();
}

function clear() {
  document.getElementById("id").value = "";
  document.getElementById("code").value = "";
  document.getElementById("name").value = "";
  document.getElementById("clas").value = "";
  document.querySelector('input[name="gender"]:checked').checked = false;
  document.getElementById("birth").value = "";
  document.getElementById("born").value = "";
  document.getElementById("submitStudent").innerText = "Thêm";
}

document.getElementById("submitStudent").addEventListener("click", AddStudent);

displayStudents();
