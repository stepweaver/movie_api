const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  fs = require('fs'),
  morgan = require('morgan');

app.use(bodyParser.json());
app.use(morgan('common'));

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
    stars: {
      name: 'Robert Pattinson',
      name: 'Zoë Kravitz',
      name: 'Jeffrey Wright'
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
    stars: {
      name: 'Christian Bale',
      name: 'Heath Ledger',
      name: 'Aaron Eckhart'
    },
    imageURL: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
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
      bio: "Steve Andrew Soderbergh was born on January 14, 1963 in Atlanta, Georgia, USA, the second of six ",
      birth: 'January 14, 1963'
    },
    stars: {
      name: 'George Clooney',
      name: 'Brad Pitt',
      name: 'Julia Roberts'
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
    stars: {
      name: 'Allen Covert',
      name: 'Lina Carellini',
      name: 'Shirley Jones'
    },
    imageURL: 'https://m.media-amazon.com/images/M/MV5BMDFiYzQ0NzktMGNkNy00YTQ0LTgxODgtNDViNGIxMTc1NGFjL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
    featured: false
  },
  {
    title: 'The Matrix',
    year: '1999',
    rating: 'R',
    description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
    genre: {
      name: 'Action',
      description: 'Action film is a genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
    },
    director: {
      name: 'Lana Wachowski',
      bio: "Lana Wachowski and her sister Lilly Wachowski, also known as the Wachowskis, are the duo behind such ground-breaking movies as The Matrix (1999) and Cloud Atlas (2012). Born to mother Lynne, a nurse, and father Ron, a businessman of Polish descent, Wachowski grew up in Chicago and formed a tight creative relationship with her sister Lilly. After the siblings dropped out of college, they started a construction business and wrote screenplays. Their 1995 script, Assassins (1995), was made into a movie, leading to a Warner Bros contract. After that time, the Wachowskis devoted themselves to their movie careers. In 2012, during interviews for Cloud Atlas and in her acceptance speech for the Human Rights Campaign's Visibility Award, Lana spoke about her experience of being a transgender woman, sacrificing her much cherished anonymity out of a sense of responsibility. Lana is known to be extremely well-read, loves comic books and exploring ideas of imaginary worlds, and was inspired by Stanley Kubrick's 2001: A Space Odyssey (1968) in creating Cloud Atlas.",
      birth: 'June 21, 1965'
    },
    director: {             // TEST! WILL THIS WORK WITH TWO OBJECTS BY THE SAME NAME?
      name: 'Lilly Wachowski',  
      bio: "Director, writer, and producer Lilly Wachowski was born in 1967 in Chicago, the daughter of Lynne, a nurse and painter, and Ron, a businessman. Lilly was educated at Kellogg Elementary School in Chicago, before moving on to Whitney M. Young High School. After graduating from high school, she attended Emerson College in Boston but dropped out. Lilly teamed up with her older sibling, Lana Wachowski, and began working on films. Their first script was optioned and formed the basis for the film Assassins (1995). The Wachowskis went on to make their directorial debut with the self-written Bound (1996), which was well-received. They followed this with the smash hit The Matrix (1999) and went on to produce two successful sequels, The Matrix Reloaded (2003) and The Matrix Revolutions (2003).",
      birth: 'December 29, 1967'
    },
    stars: {
      name: 'Keanu Reeves',
      name: 'Laurence Fishburne',
      name: 'Carrie-Anne Moss'
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
      bio: "He came from a kick-boxing background; he entered the film field as a stunt performer at the age of 24. Before that, he worked as an instructor at the Inosanto Martial Arts Academy in California, teaching Jeet Kune Do/Jun Fan. After doing numerous roles in low budget martial art movies like Mission of Justice (1992) and Bloodsport III (1996) his first start as a stunt double came from the movie The Crow (1994) for doubling late Brandon Lee whom he trained with at the Inosanto Academy. After Brandon Lee's lethal accident Chad was picked for his stunt/photo double because he knew Lee, how he moved, and looked more like him than any other stuntman. His greatest break as a stunt man came when he hooked up with Keanu Reeves on The Matrix (1999). He worked as martial arts stunt coordinator in its following sequels and doubled Keanu Reeves for extreme shots. He also formed a company called Smashcut with his stunt colleagues which was responsible for cool stunts in some of the greatest movies and series.",
      birth: 'September 20, 1968'
    },
    stars: {
      name: 'Keanu Reeves',
      name: 'Michael Nyqvist',
      name: 'Alfie Allen'
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
    stars: {
      name: 'Daniel Craig',
      name: 'Eva Green',
      name: 'Judi Dench'
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
    stars: {
      name: 'Kurt Russell',
      name: 'Kim Cattrall',
      name: 'Dennis Dun'
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
      bio: 'Robert Longo was born on January 7, 1953 in Brooklyn, New York, USA. He is a director and writer, known for Johnny Mnemonic (1995), R.E.M.: The One I Love (1987) and Arena Brains (1987).'
    },
    stars: {
      name: 'Keanu Reeves',
      name: 'Dolph Lundgren',
      name: 'Dina Meyer'
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
    stars: {
      name: 'Judith Hoag',
      name: 'Elias Koteas',
      name: 'Josh Pais'
    },
    imageURL: 'https://m.media-amazon.com/images/M/MV5BNzg3NTQ4NDk5NV5BMl5BanBnXkFtZTgwNzMzNDg4NjE@._V1_.jpg',
    featured: false
  },
];

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

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });