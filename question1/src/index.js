import express, { json } from 'express'; 

const app = express();
const PORT = 3000;

app.use(json()); 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
