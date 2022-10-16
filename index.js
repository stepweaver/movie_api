const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  fs = require('fs'),
  morgan = require('morgan');

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));

let users = [
  {
    id: 1,
    name: 'Stephen',
    favoriteMovies: [
      'Fight Club'
    ]
  },
  {
    id: 2,
    name: 'Mike',
    favoriteMovies: []
  },
  {
    id: 3,
    name: 'Kathy',
    favoriteMovies: [
      "Grandma's Boy"
    ]
  }
];

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
    imageURL: 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg',
    featured: false
  },
  {
    title: 'The Dark Knight',
    year: '2008',
    rating: 'PG-13',
    description: "When the Joker wreaks havoc and chaos on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: {
      name: 'Action',
      description: 'Action film is a genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
    },
    director: {
      name: 'Christopher Nolan',
      bio: 'Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made.',
      birth: 'July 30, 1970'
    },
    imageURL: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    featured: false
  },
  {
    title: 'Memento',
    year: '2000',
    rating: 'R',
    description: "A man with short-term memory loss attempts to track down his wife's murderer.",
    genre: {
      name: 'Mystery',
      description: 'A mystery film is a genre of film that revolves around the solution of a problem or a crime. It focuses on the efforts of the detective, private investigator or amateur sleuth to solve the mysterious circumstances of an issue by means of clues, investigation, and clever deduction.'
    },
    director: {
      name: 'Christopher Nolan',
      bio: 'Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made.',
      birth: 'July 30, 1970'
    },
    imageURL: 'https://m.media-amazon.com/images/M/MV5BZTcyNjk1MjgtOWI3Mi00YzQwLWI5MTktMzY4ZmI2NDAyNzYzXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg',
    featured: false
  },
  {
    title: "Ocean's Eleven",
    year: '2001',
    rating: 'PG-13',
    description: "Danny Ocean and his ten accomplices plan to rob three Las Vega casinos simultaneously.",
    genre: {
      name: 'Crime',
      description: 'Crime is a film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection. Stylistically, the genre may overlap and combine with many other genres, such as drama or gangster film, but also include comedy, and, in turn, is divided into many sub-genres, such as mystery, suspense or noir.'
    },
    director: {
      name: 'Steven Soderbergh',
      bio: `Steven Andrew Soderbergh was born on January 14, 1963 in Atlanta, Georgia, USA, the second of six children of Mary Ann (Bernard) and Peter Soderbergh. His father was of Swedish and Irish descent, and his mother was of Italian ancestry. While he was still at a very young age, his family moved to Baton Rouge, Louisiana, where his father was a professor and the dean of the College of Education at Louisiana State University. While still in high school, around the age of 15, Soderbergh enrolled in the university's film animation class and began making short 16-millimeter films with second-hand equipment, one of which was the short film "Janitor". After graduating high school, he went to Hollywood, where he worked as a freelance editor. His time there was brief and, shortly after, he returned home and continued making short films and writing scripts.`,
      birth: 'January 14, 1963'
    },
    imageURL: 'https://m.media-amazon.com/images/M/MV5BYzVmYzVkMmUtOGRhMi00MTNmLThlMmUtZTljYjlkMjNkMjJkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_.jpg',
    featured: false
  },
  {
    title: "Grandma's Boy",
    year: '2006',
    rating: 'R',
    description: 'A thirty-five-year-old video game tester has to move in with his grandma and her two old lady roommates.',
    genre: {
      name: 'Comedy',
      description: 'Comedy film is a category, which emphasizes humor. These films are designed to make the audience laugh. Films in this style traditionally have a happy ending. One of the oldest genres in film—and derived from the classical comedy in theatre.',
    },
    director: {
      name: 'Nicholaus Goossen',
      bio: "Nicholaus Goossen is known for Grandma's Boy (2006), Hustle (2022) and Hot for My Name (2020).",
      birth: 'August 18, 1978',
    },
    imageURL: 'https://m.media-amazon.com/images/M/MV5BMDFiYzQ0NzktMGNkNy00YTQ0LTgxODgtNDViNGIxMTc1NGFjL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
    featured: false
  },
  {
    title: 'Fight Club',
    year: '1999',
    rating: 'R',
    description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
    genre: {
      name: 'Drama',
      description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone. A primary element in a drama is the occurrence of conflict—emotional, social, or otherwise—and its resolution in the course of the storyline.',
    },
    director: {
      name: 'David Fincher',
      bio: "David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California. When he was 18 years old he went to work for John Korty at Korty Films in Mill Valley. He subsequently worked at ILM (Industrial Light and Magic) from 1981-1983. Fincher left ILM to direct TV commercials and music videos after signing with N. Lee Lacy in Hollywood. He went on to found Propaganda in 1987 with fellow directors Dominic Sena, Greg Gold and Nigel Dick. Fincher has directed TV commercials for clients that include Nike, Coca-Cola, Budweiser, Heineken, Pepsi, Levi's, Converse, AT&T and Chanel. He has directed music videos for Madonna, Sting, The Rolling Stones, Michael Jackson, Aerosmith, George Michael, Iggy Pop, The Wallflowers, Billy Idol, Steve Winwood, The Motels and, most recently, A Perfect Circle.",
      birth: 'August 28, 1962'
    },
    imageURL: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg',
    featured: false
  },
  {
    title: 'John Wick',
    year: '2014',
    rating: 'R',
    description: 'An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took his car.',
    genre: {
      name: 'Action',
      description: 'Action film is a genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
    },
    director: {
      name: 'Chad Stahelski',
      bio: "He came from a kick-boxing background; he entered the film field as a stunt performer at the age of 24. Before that, he worked as an instructor at the Inosanto Martial Arts Academy in California, teaching Jeet Kune Do/Jun Fan. After doing numerous roles in low budget martial art movies like Mission of Justice (1992) and Bloodsport III (1996) his first start as a stunt double came from the movie The Crow (1994) for doubling late Brandon Lee whom he trained with at the Inosanto Academy. After Brandon Lee's lethal accident Chad was picked for his stunt/photo double because he knew Lee, how he moved, and looked more like him than any other stuntman.",
      birth: 'September 20, 1968'
    },
    imageURL: 'https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_.jpg',
    featured: false
  },
  {
    title: 'Casino Royale',
    year: '2006',
    rating: 'PG-13',
    description: 'After earning 00 status and a licence to kill, secret agent James Bond sets out on his first mission as 007. Bond must defeat a private banker funding terrorists in a high-stakes game of poker at Casino Royale, Montenegro.',
    genre: {
      name: 'Action',
      description: 'Action film is a genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
    },
    director: {
      name: 'Martin Campbell',
      bio: "Martin Campbell knows how to entertain an audience when he steps behind the camera. When he directed The Mask of Zorro (1998), the movie earned Academy Award and Golden Globe nominations and launched the international careers of Antonio Banderas and Catherine Zeta-Jones. Next, when he helmed Vertical Limit (2000), the film was well received by the critics and earned over $200 million in worldwide box-office sales. In addition, Campbell is credited with rejuvenating the James Bond franchise when he directed GoldenEye (1995), Pierce Brosnan's first outing as the famed British spy, which went on to gross more than $350 million. He also directed Daniel Craig's debut Bond feature as well, Casino Royale (2006).",
      birth: 'October 24, 1943'
    },
    imageURL: 'https://m.media-amazon.com/images/M/MV5BYmI3MmMzMGMtNzc4Ni00YWQ4LWFkMDYtNjVlOWU3ZGZiNjY1XkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_.jpg',
    featured: false
  },
  {
    title: 'Big Trouble in Little China',
    year: '1986',
    rating: 'PG-13',
    description: 'A rough-and-tumble trucker and his side kick face off with an ancient sorcerer in a supernatural battle beneath Chinatown.',
    genre: {
      name: 'Action',
      description: 'Action film is a genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
    },
    director: {
      name: 'John Carpenter',
      bio: 'John Howard Carpenter was born in Carthage, New York, to mother Milton Jean (Carter) and father Howard Ralph Carpenter. His family moved to Bowling Green, Kentucky, where his father, a professor, was head of the music department at Western Kentucky University. He attended Western Kentucky University and then USC film school in Los Angeles. He began making short films in 1962, and won an Academy Award for Best Live-Action Short Subject in 1970, for The Resurrection of Broncho Billy (1970), which he made while at USC. Carpenter formed a band in the mid-1970s called The Coupe de Villes, which included future directors Tommy Lee Wallace and Nick Castle. Since the 1970s, he has had numerous roles in the film industry including writer, actor, composer, producer, and director. After directing Dark Star (1974), he has helmed both classic horror films like Halloween (1978), The Fog (1980), and The Thing (1982), and noted sci-fi tales like Escape from New York (1981) and Starman (1984).',
      birth: 'January 16, 1948'
    },
    imageURL: 'https://m.media-amazon.com/images/M/MV5BNzlhYjEzOGItN2MwNS00ODRiLWE5OTItYThiNmJlMTdmMzgxXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg',
    featured: false
  },
  {
    title: 'Johnny Mnemonic',
    year: '1995',
    rating: 'R',
    description: 'A data courier, literally carrying a data package inside his head, must deliver it before he dies from the burden or is killed by the Yakuza.',
    genre: {
      name: 'Action',
      description: 'Action film is a genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
    },
    director: {
      name: 'Robert Longo',
      bio: 'Robert is a director and writer, known for Johnny Mnemonic (1995), R.E.M.: The One I Love (1987) and Arena Brains (1987).',
      birth: 'January 7, 1953'
    },
    imageURL: 'https://m.media-amazon.com/images/M/MV5BNTdhYjEzYTEtYTkwZC00NzgxLWI0ZWEtYmEyMGZhOWYwMjE2XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg',
    featured: false
  },
  {
    title: 'Teenage Mutant Ninja Turtles',
    year: '1990',
    rating: 'PG',
    description: 'Four teenage mutant ninja turtles emerge from the shadows to protect New York City from a gang of criminal ninjas.',
    genre: {
      name: 'Action',
      description: 'Action film is a genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
    },
    director: {
      name: 'Steve Barron',
      bio: "Steve Barron started in films as a camera assistant on epic productions such as Richard Donner's 'Superman', Richard Attenborough's 'A Bridge Too Far' and Ridley Scott's The Duellists (1977). He began directing music videos in the early eighties for The Jam, Human League, and Adam & the Ants, his work helping to inspire the formation of MTV. In 1982 he conceived and directed the award winning 'Billie-Jean' - the first single of Michael Jackson's incredible 'Thriller' album. More seminal videos followed. Dire Straits' 'Money for Nothing' won Best Video at the 1986 MTV Awards and A-Ha's 'Take On Me' was awarded Best Director. Steve's debut feature film was the music-led romantic comedy 'Electric Dreams' starring Virginia Madsen, released worldwide in 1984.",
      birth: 'May 4, 1956'
    },
    imageURL: 'https://m.media-amazon.com/images/M/MV5BNzg3NTQ4NDk5NV5BMl5BanBnXkFtZTgwNzMzNDg4NjE@._V1_.jpg',
    featured: false
  },
];

// CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("User's name not entered")
  }
});

app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(201).send(`${movieTitle} has been added to user ${id}`);
  } else {
    res.status(404).send('User not found');
  }
});

// READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies)
});

app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.title === title);
  
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).send('Title not found');
  }
});

app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.genre.name === genreName).genre;
  
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).send('Genre not found');
  }
});

app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.director.name === directorName).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).send('Director not found');
  }
});

// UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(404).send('User not found');
  }
});

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title != movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}`);
  } else {
    res.status(404).send('User not found');
  }
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter(user => user.id != id);
    res.status(200).send(`User ${id}, ${user.name}, has been deregistered`);
  } else {
    res.status(404).send('User not found');
  }
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });