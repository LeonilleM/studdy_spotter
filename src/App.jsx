
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar'
import Footer from './components/Navigation/Footer'
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Home/Home';
import University from './pages/University/University'
import Reviews from './pages/University/Reviews/Reviews'

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
      </Routes>
      <Footer />

    </div>
  )
}

export default App
