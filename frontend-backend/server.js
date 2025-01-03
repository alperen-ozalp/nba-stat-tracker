require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const pool = require('./db');  
const cors = require('cors');
const session = require('express-session');

const flash = require('connect-flash');
const teamRoutes = require('./routes/teamRoutes'); 
const playerRoutes = require('./routes/playerRoutes');
const userRoutes = require('./routes/userRoutes');                                                            
const UserController = require('./controllers/user');


const expressLayouts = require('express-ejs-layouts');
const PlayerController = require('./controllers/player');
const PlayerBusiness = require('./business/player');



const app = express();
app.use(express.urlencoded({ extended: true }));


app.use(flash());

app.use(helmet());  
app.use(cors());
app.use(bodyParser.json()); 
app.use(morgan('dev'));  
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(expressLayouts);  

app.use(session({
  secret: 'your_secret_key',  
  resave: true,            
  saveUninitialized: false,  
  cookie: { secure: false }   
}));


app.use('/admin', UserController.authenticate, UserController.authorizeAdmin);
app.use('/admin/team', teamRoutes);      
app.use('/admin/players', playerRoutes); 
app.use('/admin/user', userRoutes) 

app.use('/team', teamRoutes);
app.use('/player', playerRoutes);
app.use('/user', userRoutes);


app.get('/user', (req, res) => {
  res.render('login', { 
    action: 'login' ,
    title: 'login' ,
    user: req.session.username,
    layout: 'layouts/main'
  });
});

app.get('/user/register', (req, res) => {
  res.render('register', { 
    action: 'register' ,
    title: 'register' ,

    user: req.session.username,
    layout: 'layouts/main'
  });
});

app.get('/player/update/:player_id', (req, res) => {
  res.render('playerupdate', { 
    user: req.session.username,
    player: req.player,
    layout: 'layouts/main'
  });
});

app.get("/", function(req, res){
  res.render("about", {user: req.session.username ,title:'Welcome Back',layout: 'layouts/main'})
});

app.get('/matchup', async (req, res) => {
  try {
    const playerQuery = `SELECT * FROM player_stats,player_info WHERE player_info.player_id = player_stats.player_id and player_stats.season = 2025`;
    const [results] = await pool.query(playerQuery);  
    console.log(results);
    res.render('matchup', {
      title: 'Players Details',
      players: results, 
      user: req.session.username,
      layout: 'layouts/main',
    });
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).send('Error fetching players');
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An error occurred. Please try again later.',
  });
});

process.on('SIGINT', async () => {
  console.log('Closing database connection pool...');
  try {
    await pool.end();  
    console.log('Database connection pool closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error closing the database connection pool:', err.stack);
    process.exit(1);
  }
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
