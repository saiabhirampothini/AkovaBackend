const express = require("express");
const connectDb = require("./config/db");
const cors = require("cors");
const app = express();

//Connect to db
connectDb();

//Init middleware to parse json data
app.use(express.json({ extended: false }));

//
app.use(cors());

//Test Route
app.get("/", (req, res) => {
  res.send("Hi,API Running");
});

//Defining Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/postproblem", require("./routes/postproblem"));
app.use("/api/getposts", require("./routes/getposts"));
app.use("/api/idea", require("./routes/idea"));
app.use("/api/invest", require("./routes/invest"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
