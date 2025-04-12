
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar'
import Footer from './components/Navigation/Footer'
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Home/Home';
import University from './pages/University/UniversityPage'
import Reviews from './pages/Reviews/ReviewsPage'
import About from './pages/About/About';
import AllSchools from './pages/AllSchools/AllSchools';
import Account from './pages/Account/Account';
import Setting from './pages/Setting/Setting';
import RequestLocation from './pages/RequestLocation/RequestLocation';
import ProtectedRoute from './services/Auth/ProtectedRoute';
import AdminRoute from './services/Auth/AdminRoute';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import PrivatePrivacy from './pages/PrivatePrivacy/PrivatePrivacy';
import Suggestion from './pages/Suggestion/Suggestion';
import NotFound from './pages/NotFound/NotFound';

function App() {


  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/university/:uniName" element={<University />} />
        <Route path="/university/:uniName/:studyLocation" element={<Reviews />} />
        <Route path="/university/request-location" element={<RequestLocation />} />
        <Route path="/about" element={<About />} />
        <Route path="/allschools" element={<AllSchools />} />
        <Route path="/privacy-policy" element={<PrivatePrivacy />} />
        <Route path="/account/:userName" element={<ProtectedRoute Component={Account} />} />
        <Route path="/setting" element={<ProtectedRoute Component={Setting} />} />
        <Route path="/suggestion" element={<Suggestion />} />
        <Route path="/admin-dashboard" element={<AdminRoute Component={AdminDashboard} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
