export type Game = {
    name: string;
    description: string;
    image: string;
    rules: string;
    minPlayers: number;
    maxPlayers: number;
  };

export type LobbyContentProps = {
  activeTab: string;
  game: Game;
};