import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './utils/db';
import cartRouter from './routes/cartRoutes';  
/* import addressRouter from './routes/addressRoutes'; 
 */import authRouter from './routes/authRouter'; 
const cors = require('cors');
const app = express();

app.use(cors());
// Middleware setup
app.use(bodyParser.json());
app.use('/api', authRouter);
app.use('/cart', cartRouter);

// Routes setup
app.use('/auth', authRouter); 

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

/* 
const startServer = async () => {
  try {
      // Sync all models
      await sequelize.sync({ alter: true }); 
      console.log("All models were synchronized successfully.");
  } catch (error) {
      console.error("Error synchronising models:", error);
  }
};
startServer(); */
export default sequelize;
