const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  fs = require('fs'),
  uuid = require('uuid'),
  path = require('path');

const app = express();

app.use(bodyParser.json());

app.use(morgan('common'));

let movies = [
  {
    title: 'The Batman',
    year: '2022',
    rating: 'PG-13',
    genre: 'Action, Crime, Drama',
    stars: 'Robert Pattinson, Zoë Kravitz, Jeffrey Wright',
    director: 'Matt Reeves',
    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    imageURL: 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg'
  },
  {
    title: 'The Dark Knight',
    year: '2008',
    rating: 'PG-13',
    genre: 'Action, Crime, Drama',
    stars: 'Christian Bale, Heath Ledger, Aaron Eckhart',
    director: 'Christopher Nolan',
    description: "When the Joker wreaks havoc and chaos on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    imageURL: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg'
  },
  {
    title: "Ocean's Eleven",
    year: '2001',
    rating: 'PG-13',
    genre: 'Crime, Thriller',
    stars: 'George Clooney, Brad Pitt, Julia Roberts',
    director: 'Steven Soderbergh',
    description: "Danny Ocean and his ten accomplices plan to rob three Las Vega casinos simultaneously.",
    imageURL: 'https://m.media-amazon.com/images/M/MV5BYzVmYzVkMmUtOGRhMi00MTNmLThlMmUtZTljYjlkMjNkMjJkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_.jpg'
  },
  {
    title: "Grandma's Boy",
    year: '2006',
    rating: 'R',
    genre: 'Comedy',
    stars: 'Allen Covert, Lina Carellini, Shirley Jones',
    director: 'Nicholaus Goossen',
    description: 'A thirty-five-year-old video game tester has to move in with his grandma and her two old lady roommates.',
    imageURL: 'https://m.media-amazon.com/images/M/MV5BMDFiYzQ0NzktMGNkNy00YTQ0LTgxODgtNDViNGIxMTc1NGFjL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg'
  },
  {
    title: 'The Matrix',
    year: '1999',
    rating: 'R',
    genre: 'Action, Sci-Fi',
    stars: 'Keanu Reeves, Laurence Fisburne, Carrie-Anne Moss',
    director: 'Lana Wachowski, Lilly Wachowski',
    description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
    imageURL: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg'
  },
  {
    title: 'John Wick',
    year: '2014',
    rating: 'R',
    genre: 'Action, Crime, Thriller',
    stars: 'Keanu Reeves, MIchael Nyqvist, Alfie Allen',
    director: 'Chad Stahelski',
    description: 'An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took his car.',
    imageURL: 'https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_.jpg'
  },
  {
    title: 'Casino Royale',
    year: '2006',
    rating: 'PG-13',
    genre: 'Action, Adventure, Thriller',
    stars: 'Daniel Craig, Eva Green, Judi Dench',
    director: 'Martin Campbell',
    description: 'After earning 00 status and a licence to kill, secret agent James Bond sets out on his first mission as 007. Bond must defeat a private banker funding terrorists in a high-stakes game of poker at Casino Royale, Montenegro.',
    imageURL: 'https://m.media-amazon.com/images/M/MV5BYmI3MmMzMGMtNzc4Ni00YWQ4LWFkMDYtNjVlOWU3ZGZiNjY1XkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_.jpg'
  },
  {
    title: 'Big Trouble in Little China',
    year: '1986',
    rating: 'PG-13',
    genre: 'Action, Adventure, Comedy',
    stars: 'Kurt Russell, Kim Cattrall, Dennis Dun',
    director: 'John Carpenter',
    description: 'A rough-and-tumble trucker and his side kick face off with an ancient sorcerer in a supernatural battle beneath Chinatown.',
    imageURL: 'https://m.media-amazon.com/images/M/MV5BNzlhYjEzOGItN2MwNS00ODRiLWE5OTItYThiNmJlMTdmMzgxXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg'
  },
  {
    title: 'Johnny Mnemonic',
    year: '1995',
    rating: 'R',
    genre: 'Action, Drama, Sci-Fi',
    stars: 'Keanu Reeves, Dolph Lundgren, Dina Meyer',
    director: 'Robert Longo',
    description: 'A data courier, literally carrying a data package inside his head, must deliver it before he dies from the burden or is killed by the Yakuza.',
    imageURL: 'https://m.media-amazon.com/images/M/MV5BNTdhYjEzYTEtYTkwZC00NzgxLWI0ZWEtYmEyMGZhOWYwMjE2XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg'
  },
  {
    title: 'Teenage Mutant Ninja Turtles',
    year: '1990',
    rating: 'PG',
    genre: 'Action, Adventure, Comedy',
    stars: 'Judith Hoag, Elias Koteas, Josh Pais',
    director: 'Steve Barron',
    description: 'Four teenage mutant ninja turtles emerge from the shadows to protect New York City from a gang of criminal ninjas.',
    imageURL: 'https://m.media-amazon.com/images/M/MV5BNzg3NTQ4NDk5NV5BMl5BanBnXkFtZTgwNzMzNDg4NjE@._V1_.jpg'
  },
];

app.get('/', (req, res) => {
  res.send('Welcome to my awesome movies app!');
});

// Gets data for ALL movies
// First line routes the request to the endpoint '/movies'
// Second line defines the format of the response - a JSON object holding data about all movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

//Get data for a single movie, by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.title === req.params.title
  }));
});

app.get('/movies/:genre', (req, res) => {
  res.json(movies.find((genre) => {
    return genre.genre === req.params.genre
  }));
});

app.get('/movies/:director', (req, res) => {
  res.json(movies.find((director) => {
    return director.director === req.params.director
  }));
});

app.get('/movies/:stars', (req, res) => {
  res.json(movies.find((stars) => {
    return stars.stars === req.params.stars
  }));
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('What did you do!?');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
