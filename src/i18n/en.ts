import { b, sup } from "framer-motion/client";

interface Language {
  [key: string]: string;
}

export const en: Language = {
  // Navigation
  home: "Home",
  games: "Games",
  login: "Login",
  signup: "Sign Up",
  profile: "Profile",
  signOut: "Sign Out",
  playAsGuest: "Play as Guest",

  // Home Page
  heroTitle: "Play Board & Card Games Online",
  heroSubtitle:
    "Join thousands of players on Greaclos for the ultimate online board game experience.",
  signupFree: "Sign Up Free",
  createAccount: "Create Free Account",
  browseGames: "Browse Games",
  whyChooseTitle: "Why Choose Greaclos?",
  whyChooseSubtitle: "The ultimate platform for online board and card gaming",
  varietyGames: "Variety of Games",
  varietyGamesDesc:
    "Enjoy a growing collection of classic and modern board games, card games, and more.",
  playWithFriends: "Play with Friends",
  playWithFriendsDesc:
    "Create private game rooms, invite friends, and enjoy multiplayer gaming together.",
  competeRank: "Compete & Rank",
  competeRankDesc:
    "Track your progress, earn achievements, and climb the leaderboards.",
  featuredGames: "Featured Games",
  featuredGamesSubtitle: "Check out some of our most popular games",
  viewAllGames: "View All Games",
  readyToPlay: "Ready to Play?",
  readyToPlayDesc:
    "Join Greaclos today and start playing your favorite board and card games online with players from around the world.",

  // Games Page
  browseGamesTitle: "Browse Games",
  browseGamesSubtitle: "Find your favorite games to play online",
  searchGames: "Search games...",
  allGames: "All Games",
  strategy: "Strategy",
  cardGames: "Card Games",
  familyGames: "Family Games",
  wordGames: "Word Games",
  players: "Players",
  // Difficulty
  difficulty: "Difficulty",
  medium: "Medium",
  easy: "Easy",
  hard: "Hard",
  playNow: "Play Now",
  notFoundGameMatching: "No games found matching your search criteria.",
  showAllGames: "Show All Games",

  // Game Lobby Page
  activeGames: "Active Games",
  btnNewGame: "Create New Game",
  btnJoinGame: "Join Game",
  lobbyChat: "Lobby Chat",
  statusWaiting: "waiting",
  statusFull: "full",
  gameInfo: "Game Info",
  createGame: "Create Game",
  noActiveGames: "No active games at the moment.",
  loadingGame: "Loading game...",
  typeMessage: "Type your message...",
  guestMessage:
    "You are currently playing as a guest. To save your progress and access more features, please create an account or log in.",
  rules: "Rules",
  howToPlay: "How to Play",
  howToPlayDesc:
    "1- Join an existing game or create a new one.\n2-  Wait for other players to join if needed.\n3- The game will start automatically once all players are ready.\n4- Follow the in-game instructions and have fun!",

  // Auth Pages
  emailLabel: "Email",
  passwordLabel: "Password",
  confirmPasswordLabel: "Confirm Password",
  usernameLabel: "Username",
  signInTitle: "Sign in to your account",
  createAccountTitle: "Create your account",
  alreadyHaveAccount: "Already have an account?",
  dontHaveAccount: "Don't have an account?",
  signIn: "Sign In",

  // Profile Page
  statistics: "Statistics",
  gameHistory: "Game History",
  settings: "Settings",
  gamesPlayed: "Games Played",
  wins: "Wins",
  losses: "Losses",
  winRate: "Win Rate",
  recentHistory: "Recent Game History",
  accountSettings: "Account Settings",
  updateProfile: "Update Profile",
  changePassword: "Change Password",

  // Footer
  aboutUs: "About Us",
  linkGames: "Games",
  blog: "Blog",
  faq: "FAQ",
  support: "Support",
  contactUs: "Contact Us",
  privacyPolicy: "Privacy Policy",
  termsOfService: "Terms of Service",
  helpCenter: "Help Center",
  siteDescription:
    "Greaclos is a modern platform for playing board and card games online with friends. Challenge players worldwide and enjoy a variety of classic and modern games.",
  allRightsReserved: "Greaclos. All rights reserved.",
};
