const express = require('express'),
  app = express(),
  bodyParser = require('body')

let movies = [
  {
    title: 'The Batman',
    year: '2022',
    rating: 'PG-13',
    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    genre: {
      name: 'Action',
      description: 'Action film is a genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
    },
    director: {
      name: 'Matt Reeves',
      bio: 'Matthew George "Matt" Reeves was born Aril 17, 1966 in Rockville Center, New York, USA and is a writer, director and producer. Reeves began making movies at age eight, directing friends and using a wind-up camera. He befriended filmmaker J.J. Abrams when both were 13 years old and a public-access television cable channel, Z Channel, aired their short films. When Reeves and Abrams were 15 or 16 years old, Steven Spielberg hired them to transfer some of his own Super 8 films to videotape. Reeves attended the University of Southern California and there, between 1991 and 1992, he produced an award-winning student film, Mr. Petrified Forest, which helped him acquire an agent. He also co-wrote a script that eventually became Under Siege 2: Dark Territory (1995). After graduating, he co-wrote The Pallbearer (1996), which became his directorial debut.',
      birth: 'April 27, 1966'
    },
    stars: 'Robert Pattinson, Zoë Kravitz, Jeffrey Wright',
    imageURL: 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg',
    featured: false
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

// READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies)
});

app.get('/movies', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.name === req.params.name
  }));

  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });
});