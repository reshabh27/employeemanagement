
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8090/empl/getAll');
      setEmployees(response.data);
      console.log(employees);
      
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleCreate = () => {
    setSelectedEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:8090/empl/delete/${employeeId}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  return (
    <div>
      {!showForm ? (
        <>
          <h1>huabc2</h1>
          <button onClick={handleCreate}>Create Employee</button>
          <table border={"1px solid black"} style={{ width: '80%', margin:'auto',marginTop: '70px' }}>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Blood Group</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee,index) => (
                <tr key={`${employee.employeeId}-${index}`}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.bloodGroup}</td>
                  <td style={{}}>
                    <button onClick={() => handleEdit(employee)}>Edit</button>
                    <button onClick={() => handleDelete(employee.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <EmployeeForm
          employee={selectedEmployee}
          onClose={() => setShowForm(false)}
          onSubmit={fetchEmployees}
        />
      )}
    </div>
  );
};

const EmployeeForm = ({ employee, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    employeeId: employee?.employeeId || '',
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    bloodGroup: employee?.bloodGroup || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8090/empl/add', formData);
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <div>
      <h2>{employee ? 'Edit Employee' : 'Create Employee'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee ID:</label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Blood Group:</label>
          <input
            type="text"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{employee ? 'Update' : 'Submit'}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default App;
