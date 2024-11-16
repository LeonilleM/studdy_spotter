
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar'
import Footer from './components/Navigation/Footer'
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Home/Home';
import University from './pages/University/University'
import Reviews from './pages/University/Reviews/Reviews'
import About from './pages/About/About';
import AllSchools from './pages/AllSchools/AllSchools';
import Account from './pages/Account/Account';
import Setting from './pages/Setting/Setting';
import RequestLocation from './pages/University/RequestLocation/RequestLocation';
import ProtectedRoute from './services/Auth/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

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
        <Route path="/account/:userName" element={<ProtectedRoute Component={Account} />} />
        <Route path="/setting" element={<ProtectedRoute Component={Setting} />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute Component={AdminDashboard} />} />
      </Routes>
      <Footer />

    </div>
  )
}

export default App
