const app = require("./app");
const PORT = process.env.PORT || 80


app.listen(PORT, () => {
  console.log(
    `Server is active on http://127.0.0.1:${PORT}`
  );
});
