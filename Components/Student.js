import React, { useEffect, useState } from "react";
import "../Lables/Student.css";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Student() {
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState({
    id: null,
    name: "",
    email: "",
    rollnumber: "",
    phoneNumber: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  function fetchStudents() {
    fetch("http://localhost:8080/students/all")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => {
        console.error("Error fetching students:", error);
        toast.warn("Error fetching students"); 
      });
  }

  function submitHandler(event) {
    event.preventDefault();

    if (
      !currentStudent.name ||
      !currentStudent.email ||
      !currentStudent.rollnumber ||
      !currentStudent.phoneNumber
    ) {
      toast.warn("Please fill out all fields.");
      return;
    }

    // Additional validation with SweetAlert
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(currentStudent.email)) {
      toast.warn("Please enter a valid email address.");
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(currentStudent.phoneNumber)) {
      toast.warn(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    const requestMethod = currentStudent.id ? "PUT" : "POST";
  const apiUrl = currentStudent.id
    ? `http://localhost:8080/students/updatestu/${currentStudent.id}`
    : "http://localhost:8080/students/save";

  fetch(apiUrl, {
    method: requestMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(currentStudent),
  })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then(() => {
      // Resetting form and fetching students list
      setCurrentStudent({
        id: null,
        name: "",
        email: "",
        rollnumber: "",
        phoneNumber: "",
      });
      fetchStudents();
      toast.success(`Student has been ${currentStudent.id ? "updated" : "added"} successfully.`);
    })
    .catch((errorResponse) => {
      if (errorResponse.status === 400) {
        errorResponse.json().then((body) => {
          const errorMessage = body.message || `Error ${currentStudent.id ? "updating" : "adding"} student.`;
          console.error(errorMessage);
          toast.error(errorMessage); 
        }).catch(() => {
          console.error("Error parsing error response:", errorResponse);
          toast.error("An unexpected error occurred.");
        });
      } else {
        console.error("Something went wrong:", errorResponse);
        toast.error("An unexpected error occurred.");
      }
    });    
}

  function editStudent(student) {
    setCurrentStudent(student);
  }

  function deleteStudent(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/students/delete/${id}`, {
          method: "DELETE",
        })
          .then(() => {
            fetchStudents();
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting student:", error);
            Swal.fire("Error!", "Error deleting student.", "error");
          });
      }
    });
  }
  function handleInputChange(event) {
    const { name, value } = event.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  }
  return (
    <div className="App">
      <h2>Students</h2>
      <table className="table">
        <thead>
          <tr>
            <th className="name-column">Name</th>
            <th className="email-column">Email</th>
            <th className="rollnumber-column">Roll Number</th>
            <th className="phonenumber-column">Phonenumber</th>
            <th className="action-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.rollnumber}</td>
              <td>{student.phoneNumber}</td>
              <td>
                <Button
                  type="button"
                  class="btn btn-primary"
                  onClick={() => editStudent(student)}
                  style={{
                    color: "blue",
                    marginBottom: "5px",
                    marginRight: "20px",
                    width: "60px",
                  }}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  class="btn btn-danger"
                  onClick={() => deleteStudent(student.id)}
                  style={{ color: "red" }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                className="student"
                type="text"
                placeholder="Name"
                name="name"
                value={currentStudent.name}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={currentStudent.email}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Roll Number"
                name="rollnumber"
                value={currentStudent.rollnumber}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="phone Number"
                name="phoneNumber"
                value={currentStudent.phoneNumber}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <button
                type="button"
                class="btn btn-primary"
                onClick={submitHandler}
                style={{ color: "green", width: "90px" }}
              >
                {" "}
                {currentStudent.id ? "Update" : "Add"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
