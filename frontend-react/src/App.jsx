import './App.css';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HowItWorksPage from './pages/HowItWorksPage';
import CreateListingPage from './pages/CreateListingPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/annonces' element={<ListingsPage />} />
      <Route path="/annonces/:id" element={<ListingDetailPage />} />
      <Route path="/connexion" element={<LoginPage />} />
      <Route path="/inscription" element={<RegisterPage />} />
      <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
      <Route path="/deposer-annonce" element={<CreateListingPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/mon-compte" element={<ProfilePage />} />
        <Route path="/messagerie/:id" element={<MessagesPage />} />
      </Route>
    </Routes>
  );
}

export default App
