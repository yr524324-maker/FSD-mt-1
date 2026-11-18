
const express = require("express");
const app = express();

app.use(express.json());

// Initial data
let enrollments = [
  { id: 601, studentName: "Aarav Gupta", courseCode: "CS301", courseName: "Data Structures", semester: 3, attendance: 82 },
  { id: 602, studentName: "Meera Joshi", courseCode: "CS305", courseName: "Database Systems", semester: 3, attendance: 74 },
  { id: 603, studentName: "Kabir Khan", courseCode: "CS310", courseName: "Computer Networks", semester: 3, attendance: 91 }
];

// Validation
function valid(d) {
  return d &&
    typeof d.studentName === "string" && d.studentName.trim() &&
    typeof d.courseCode === "string" && d.courseCode.trim() &&
    typeof d.courseName === "string" && d.courseName.trim() &&
    Number.isInteger(d.semester) && d.semester > 0 &&
    typeof d.attendance === "number" &&
    Number.isFinite(d.attendance) &&
    d.attendance >= 0 && d.attendance <= 100;
}

// 1. GET all enrollments
app.get("/api/enrollments", (req, res) => {
  res.status(200).json(enrollments);
});

// 2. POST new enrollment
app.post("/api/enrollments", (req, res) => {
  if (!valid(req.body))
    return res.status(400).json({ message: "Invalid data" });

  const record = {
    id: Math.max(...enrollments.map(e => e.id), 600) + 1,
    ...req.body
  };

  enrollments.push(record);
  res.status(201).json(record);
});

// 3. FILTER by semester
app.get("/api/enrollments/filter", (req, res) => {
  const semester = Number(req.query.semester);

  if (!req.query.semester || !Number.isInteger(semester) || semester <= 0)
    return res.status(400).json({ message: "Invalid semester" });

  res.status(200).json(
    enrollments.filter(e => e.semester === semester)
  );
});

// 4. GET low attendance (below 75)
app.get("/api/enrollments/low-attendance", (req, res) => {
  res.status(200).json(
    enrollments.filter(e => e.attendance < 75)
  );
});

// 5. GET enrollment by ID
app.get("/api/enrollments/:id", (req, res) => {
  const record = enrollments.find(e => e.id === Number(req.params.id));

  if (!record)
    return res.status(404).json({ message: "Enrollment not found" });

  res.status(200).json(record);
});

// 6. PUT update enrollment
app.put("/api/enrollments/:id", (req, res) => {
  const index = enrollments.findIndex(
    e => e.id === Number(req.params.id)
  );

  if (index === -1)
    return res.status(404).json({ message: "Enrollment not found" });

  if (!valid(req.body))
    return res.status(400).json({ message: "Invalid data" });

  enrollments[index] = {
    id: enrollments[index].id,
    ...req.body
  };

  res.status(200).json(enrollments[index]);
});

// 7. DELETE enrollment
app.delete("/api/enrollments/:id", (req, res) => {
  const index = enrollments.findIndex(
    e => e.id === Number(req.params.id)
  );

  if (index === -1)
    return res.status(404).json({ message: "Enrollment not found" });

  enrollments.splice(index, 1);

  res.status(200).json({ message: "Enrollment deleted successfully" });
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
