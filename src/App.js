import { useState, useEffect } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState({});
  const [editState, setEditState] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!student) {
      alert("you have not entered anything");
      return;
    }
    if (editState) {
      const result = await fetch(`http://localhost:5000/students/${student.id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(student),
      });
      const data = await result.json();
      console.log('data :>> ', data);
      setStudents((students) => [...students.filter(s => s.id !== student.id), data]);
      setEditState(false)
      setStudent({})
    } else {
      const result = await fetch("http://localhost:5000/students", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(student),
      });
      const data = result.json();
      setStudents((students) => [...students, data]);
      setStudent({})
    }
  };

  const handleDelete = async (id) => {
    const result = await fetch(`http://localhost:5000/students/${id}`, {
      method: "DELETE",
    });
    const data = result.json();
    setStudents(students.filter((s) => s.id !== data.id));
  };

  const handleEdit = async (id) => {
    setEditState(true)
    setStudent(students.find(s => s.id === id))
  };

  useEffect(() => {
    const fetchStudent = async () => {
      const results = await fetch("http://localhost:5000/students");
      const data = await results.json();
      setStudents(data);
    };
    fetchStudent();
  }, []);

  return (
    <div className="App">
      <div>
        {students.map((s) => (
          <div key={s.id}>
            <h2>
              {s.name} <button onClick={() => handleEdit(s.id)}>Edit</button>
              <button onClick={() => handleDelete(s.id)}>Delete</button>
            </h2>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name: </label>
        <input
          type="text"
          id="name"
          value={student.name ?? ''}
          onChange={(e) => setStudent({id:student.id ?? null, name: e.target.value})}
        />{" "}
        <br />
        <button type="submit">{editState ? 'Submit' : 'Add'}</button>
      </form>
    </div>
  );
}

export default App;
