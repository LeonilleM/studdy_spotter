
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
import RequestLocation from './pages/University/RequestLocation/RequestLocation';
import ProtectedRoute from './services/Auth/ProtectedRoute';

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
      </Routes>
      <Footer />

    </div>
  )
}

export default App
