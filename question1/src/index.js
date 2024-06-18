import express from 'express';
import routes from './routes.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/categories', routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
