export type TourInfo = {
  id: number;
  name: string;
  venue: string;
  date: string;
  gendate: string;
};

export type Result = {
  id: number;
  player1: string;
  player2: string;
  winner: string;
  result: {
    count: {
      c1: number;
      c2: number;
    };
    game: {
      set?: { player1: number; player2: number };
    };
    name: string;
  };
};

export type ApiResponse = { [key: string]: Result[] };

export type Players = {
  id: number;
  name: string;
  group: string;
  seed: number;
};
