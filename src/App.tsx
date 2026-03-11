import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/auth/PrivateRoute";
import LoadingSpinner from "./components/utils/LoadingSpinner";
import GameExamplePage from "./pages/GameExamplePage";

// Lazy loading das páginas
const HomePage = lazy(() => import("./pages/HomePage"));
const GamesPage = lazy(() => import("./pages/GamesPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const TicTacToePage = lazy(() => import("./pages/TicTacToePage"));
const TicTacToe2Page = lazy(() => import("./pages/TicTacToe2Page"));
const Connect4Page = lazy(() => import("./pages/Connect4Page"));
const SudokuPage = lazy(() => import("./pages/SudokuPage"));
const KempsPage = lazy(() => import("./pages/KempsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const UnoPage = lazy(() => import("./pages/UnoPage"));

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Layout>
              <Suspense
                fallback={<LoadingSpinner size="lg" className="min-h-screen" />}
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/games" element={<GamesPage />} />
                  <Route path="/games/tictactoe" element={<TicTacToePage />} />
                  <Route path="/games/example" element={<GameExamplePage />} />
                  <Route
                    path="/games/tictactoe2"
                    element={<TicTacToe2Page />}
                  />
                  <Route path="/games/uno" element={<UnoPage />} />
                  <Route path="/games/connect4" element={<Connect4Page />} />
                  <Route path="/games/sudoku" element={<SudokuPage />} />
                  <Route path="/games/kemps" element={<KempsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </Layout>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
