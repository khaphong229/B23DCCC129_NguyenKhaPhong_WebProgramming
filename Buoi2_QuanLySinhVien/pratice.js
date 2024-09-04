class SinhVien {
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

class QuanLy {
  constructor() {
    this.sinhviens = JSON.parse(localStorage.getItem("sinhviens")) || [];
  }
  them(sinhvien) {
    this.sinhviens.push(sinhvien);
    this.luu();
  }
  xoa(id) {
    this.sinhviens = this.sinhviens.filter((sinhvien) => sinhvien.id !== id);
    this.luu();
  }
  danhSachSinhVien() {
    return this.sinhviens;
  }
  sinhVienId(id) {
    return this.sinhviens.find((sinhvien) => sinhvien.id === id);
  }
  capnhat(data) {
    const idx = this.sinhviens.findIndex((sinhvien) => sinhvien.id === data.id);
    this.sinhviens[idx] = data;
    this.luu();
  }
  luu() {
    localStorage.setItem("sinhviens", JSON.stringify(this.sinhviens));
  }
}

const quanly = new QuanLy();

function display() {
  const sinhviens = quanly.danhSachSinhVien();
  const body = document.querySelector("table tbody");
  let data = "";
  sinhviens.map((sinhvien, index) => {
    const { code, name, clas, gender, birth, born } = sinhvien;
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
              <button class="action-btn edit-btn" onclick="edit('${
                sinhvien.id
              }')">Sửa</button>
              <button class="action-btn delete-btn" onclick="deleteSV('${
                sinhvien.id
              }')">Xóa</button>
            </td>
          </tr>
        `;
  });
  body.innerHTML = data;
}

function themSV(event) {
  event.preventDefault();
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

  const sv = new SinhVien(id, code, name, clas, gender, birth, born);

  if (document.getElementById("submitStudent").innerText === "Cập nhật") {
    quanly.capnhat(sv);
  } else {
    quanly.them(sv);
  }

  display();
  clear();
}

function edit(id) {
  const sinhvien = quanly.sinhVienId(id);
  document.getElementById("id").value = sinhvien.id;
  document.getElementById("code").value = sinhvien.code;
  document.getElementById("name").value = sinhvien.name;
  document.getElementById("clas").value = sinhvien.clas;

  if (sinhvien.gender === "male") {
    document.querySelector('input[name="gender"][value="male"]').checked = true;
  } else if (sinhvien.gender === "female") {
    document.querySelector(
      'input[name="gender"][value="female"]'
    ).checked = true;
  }

  document.getElementById("birth").value = sinhvien.birth;
  document.getElementById("born").value = sinhvien.born;
  document.getElementById("submitStudent").innerText = "Cập nhật";
}

function deleteSV(id) {
  quanly.xoa(id);
  display();
}

function clear() {
  document.getElementById("id").value = "";
  document.getElementById("code").value = "";
  document.getElementById("name").value = "";
  document.getElementById("clas").value = "";
  document.querySelector('input[name="gender"]:checked').checked = false;
  document.getElementById("birth").value = "";
  document.getElementById("born").value = "";
  document.getElementById("submitStudent").innerText = "Thêm sinh viên";
}

document.getElementById("submitStudent").addEventListener("click", themSV);

display();
