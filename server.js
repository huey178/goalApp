const express = require("express");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(express.json({ extended: false }));

app.use("/api/user", require("./routes/api/user"));
app.use("/api/goal", require("./routes/api/goal"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));

//Serve static assets in production

if (process.env.NODE_ENV === "production") {
  //Set Static Folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Now listening on ${PORT}`);
});
