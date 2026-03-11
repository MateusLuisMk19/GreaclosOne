export type GameRoom = {
  id: string;
  host: string;
  gameName: string;
  roomName: string;
  guests?: string[];
  status: string;
  maxPlayers: number;
  plays?: any[];
};
