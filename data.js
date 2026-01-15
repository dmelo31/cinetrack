// data.js — "banco" manual local (sem TMDB)
// Você pode editar, adicionar ou remover filmes livremente.

export const MOVIES_DB = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    genres: ["Drama"],
    rating: 9.3,
    poster: "",
    desc: "Dois homens presos desenvolvem uma amizade ao longo dos anos, encontrando esperança e redenção."
  },
  {
    id: 2,
    title: "The Godfather",
    year: 1972,
    genres: ["Crime", "Drama"],
    rating: 9.2,
    poster: "",
    desc: "A ascensão e os conflitos de uma família mafiosa liderada por Don Vito Corleone."
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    genres: ["Ação", "Crime", "Drama"],
    rating: 9.0,
    poster: "",
    desc: "Batman enfrenta o Coringa, um criminoso caótico que quer ver Gotham em ruínas."
  },
  {
    id: 4,
    title: "Pulp Fiction",
    year: 1994,
    genres: ["Crime", "Drama"],
    rating: 8.9,
    poster: "",
    desc: "Histórias entrelaçadas de crime, humor ácido e escolhas impulsivas em Los Angeles."
  },
  {
    id: 5,
    title: "Fight Club",
    year: 1999,
    genres: ["Drama"],
    rating: 8.8,
    poster: "",
    desc: "Um homem desiludido encontra um carismático rebelde e cria um clube clandestino."
  },
  {
    id: 6,
    title: "Forrest Gump",
    year: 1994,
    genres: ["Drama", "Romance"],
    rating: 8.8,
    poster: "",
    desc: "A vida extraordinária de Forrest atravessa décadas e eventos marcantes dos EUA."
  },
  {
    id: 7,
    title: "Inception",
    year: 2010,
    genres: ["Ação", "Ficção Científica", "Suspense"],
    rating: 8.8,
    poster: "",
    desc: "Um ladrão invade sonhos para roubar segredos, mas recebe uma missão quase impossível."
  },
  {
    id: 8,
    title: "The Matrix",
    year: 1999,
    genres: ["Ação", "Ficção Científica"],
    rating: 8.7,
    poster: "",
    desc: "Um hacker descobre que a realidade é uma simulação e entra na guerra contra máquinas."
  },
  {
    id: 9,
    title: "Interstellar",
    year: 2014,
    genres: ["Aventura", "Drama", "Ficção Científica"],
    rating: 8.7,
    poster: "",
    desc: "Exploradores viajam por um buraco de minhoca em busca de um novo lar para a humanidade."
  },
  {
    id: 10,
    title: "Gladiator",
    year: 2000,
    genres: ["Ação", "Drama"],
    rating: 8.5,
    poster: "",
    desc: "Um general romano é traído e busca vingança como gladiador."
  },

  // --- Mais filmes (lista variada) ---
  { id: 11, title: "Goodfellas", year: 1990, genres: ["Crime", "Drama"], rating: 8.7, poster: "", desc: "A vida no crime sob a ótica de um jovem que cresce na máfia." },
  { id: 12, title: "Se7en", year: 1995, genres: ["Crime", "Mistério"], rating: 8.6, poster: "", desc: "Dois detetives perseguem um assassino que usa os sete pecados capitais." },
  { id: 13, title: "The Silence of the Lambs", year: 1991, genres: ["Crime", "Suspense"], rating: 8.6, poster: "", desc: "Uma agente do FBI busca a ajuda de um canibal brilhante para capturar um serial killer." },
  { id: 14, title: "Saving Private Ryan", year: 1998, genres: ["Guerra", "Drama"], rating: 8.6, poster: "", desc: "Soldados atravessam a França na Segunda Guerra para resgatar um paraquedista." },
  { id: 15, title: "The Green Mile", year: 1999, genres: ["Drama", "Fantasia"], rating: 8.6, poster: "", desc: "Um carcereiro conhece um preso com um dom misterioso no corredor da morte." },
  { id: 16, title: "The Departed", year: 2006, genres: ["Crime", "Drama"], rating: 8.5, poster: "", desc: "Policial infiltrado e criminoso infiltrado se caçam em Boston." },
  { id: 17, title: "Whiplash", year: 2014, genres: ["Drama"], rating: 8.5, poster: "", desc: "Um baterista ambicioso enfrenta um professor implacável." },
  { id: 18, title: "Parasite", year: 2019, genres: ["Drama", "Suspense"], rating: 8.5, poster: "", desc: "Uma família pobre se infiltra na vida de uma família rica com consequências explosivas." },
  { id: 19, title: "Joker", year: 2019, genres: ["Drama", "Crime"], rating: 8.4, poster: "", desc: "Um homem marginalizado desce ao caos e vira símbolo de revolta em Gotham." },
  { id: 20, title: "The Prestige", year: 2006, genres: ["Drama", "Mistério"], rating: 8.5, poster: "", desc: "Dois mágicos rivais levam a obsessão a níveis perigosos." },

  { id: 21, title: "Back to the Future", year: 1985, genres: ["Aventura", "Comédia", "Ficção Científica"], rating: 8.5, poster: "", desc: "Um adolescente viaja no tempo e precisa consertar o futuro." },
  { id: 22, title: "Terminator 2: Judgment Day", year: 1991, genres: ["Ação", "Ficção Científica"], rating: 8.6, poster: "", desc: "Um exterminador é reprogramado para proteger o futuro líder da resistência." },
  { id: 23, title: "Alien", year: 1979, genres: ["Terror", "Ficção Científica"], rating: 8.5, poster: "", desc: "Uma tripulação enfrenta uma ameaça mortal a bordo de uma nave." },
  { id: 24, title: "The Thing", year: 1982, genres: ["Terror", "Ficção Científica"], rating: 8.2, poster: "", desc: "Na Antártida, uma criatura que imita humanos cria paranoia e terror." },
  { id: 25, title: "Blade Runner 2049", year: 2017, genres: ["Ficção Científica", "Drama"], rating: 8.0, poster: "", desc: "Um blade runner descobre um segredo que pode mudar o equilíbrio do mundo." },

  { id: 26, title: "Spirited Away", year: 2001, genres: ["Animação", "Fantasia"], rating: 8.6, poster: "", desc: "Uma garota entra em um mundo espiritual e precisa salvar seus pais." },
  { id: 27, title: "Toy Story", year: 1995, genres: ["Animação", "Aventura"], rating: 8.3, poster: "", desc: "Brinquedos ganham vida quando os humanos não estão olhando." },
  { id: 28, title: "The Lion King", year: 1994, genres: ["Animação", "Aventura"], rating: 8.5, poster: "", desc: "Um jovem leão aprende sobre responsabilidade e destino." },
  { id: 29, title: "Up", year: 2009, genres: ["Animação", "Aventura"], rating: 8.3, poster: "", desc: "Um senhor realiza o sonho de viajar e encontra uma amizade inesperada." },
  { id: 30, title: "WALL·E", year: 2008, genres: ["Animação", "Ficção Científica"], rating: 8.4, poster: "", desc: "Um robô solitário na Terra inicia uma aventura que pode salvar a humanidade." },

  { id: 31, title: "The Social Network", year: 2010, genres: ["Drama"], rating: 7.8, poster: "", desc: "A criação do Facebook e as disputas por poder e autoria." },
  { id: 32, title: "Django Unchained", year: 2012, genres: ["Faroeste", "Drama"], rating: 8.4, poster: "", desc: "Um ex-escravizado busca libertar sua esposa com a ajuda de um caçador de recompensas." },
  { id: 33, title: "Mad Max: Fury Road", year: 2015, genres: ["Ação", "Aventura"], rating: 8.1, poster: "", desc: "Perseguição insana em um deserto pós-apocalíptico com aliados improváveis." },
  { id: 34, title: "The Truman Show", year: 1998, genres: ["Drama", "Comédia"], rating: 8.2, poster: "", desc: "Um homem descobre que sua vida inteira é um reality show." },
  { id: 35, title: "The Grand Budapest Hotel", year: 2014, genres: ["Comédia", "Aventura"], rating: 8.1, poster: "", desc: "Um concierge e seu aprendiz se envolvem em um crime e uma herança." },

  { id: 36, title: "Taxi Driver", year: 1976, genres: ["Crime", "Drama"], rating: 8.2, poster: "", desc: "Um taxista isolado entra em espiral mental nas ruas de NY." },
  { id: 37, title: "A Clockwork Orange", year: 1971, genres: ["Crime", "Drama"], rating: 8.3, poster: "", desc: "Violência, controle social e livre-arbítrio em um futuro perturbador." },
  { id: 38, title: "Heat", year: 1995, genres: ["Crime", "Ação"], rating: 8.3, poster: "", desc: "Um detetive e um ladrão profissional se enfrentam em um jogo de gato e rato." },
  { id: 39, title: "Scarface", year: 1983, genres: ["Crime", "Drama"], rating: 8.3, poster: "", desc: "A ascensão e queda de um traficante implacável em Miami." },
  { id: 40, title: "The Big Lebowski", year: 1998, genres: ["Comédia", "Crime"], rating: 8.1, poster: "", desc: "Um cara pacato se envolve em um caso absurdo de identidade e sequestro." },

  // Mais alguns pra completar 50
  { id: 41, title: "Titanic", year: 1997, genres: ["Drama", "Romance"], rating: 7.9, poster: "", desc: "Um romance improvável no navio mais famoso da história." },
  { id: 42, title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001, genres: ["Aventura", "Fantasia"], rating: 8.8, poster: "", desc: "Um hobbit inicia uma jornada para destruir um anel poderoso." },
  { id: 43, title: "The Lord of the Rings: The Two Towers", year: 2002, genres: ["Aventura", "Fantasia"], rating: 8.8, poster: "", desc: "A guerra se aproxima e alianças são testadas." },
  { id: 44, title: "The Lord of the Rings: The Return of the King", year: 2003, genres: ["Aventura", "Fantasia"], rating: 9.0, poster: "", desc: "A batalha final decide o destino da Terra-média." },
  { id: 45, title: "Star Wars: Episode IV - A New Hope", year: 1977, genres: ["Aventura", "Ficção Científica"], rating: 8.6, poster: "", desc: "Um jovem fazendeiro se junta à rebelião contra um império tirânico." },

  { id: 46, title: "Rocky", year: 1976, genres: ["Drama", "Esporte"], rating: 8.1, poster: "", desc: "Um boxeador azarão ganha uma chance improvável de lutar pelo título." },
  { id: 47, title: "The Shining", year: 1980, genres: ["Terror", "Drama"], rating: 8.4, poster: "", desc: "Um hotel isolado desperta a loucura em um escritor." },
  { id: 48, title: "The Sixth Sense", year: 1999, genres: ["Drama", "Mistério"], rating: 8.2, poster: "", desc: "Um garoto diz ver pessoas mortas e um psicólogo tenta ajudá-lo." },
  { id: 49, title: "La La Land", year: 2016, genres: ["Drama", "Romance"], rating: 8.0, poster: "", desc: "Dois sonhadores tentam equilibrar amor e carreira em Los Angeles." },
  { id: 50, title: "No Country for Old Men", year: 2007, genres: ["Crime", "Suspense"], rating: 8.2, poster: "", desc: "Um homem encontra dinheiro do tráfico e vira alvo de um assassino implacável." },
];
