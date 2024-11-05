import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Home/Home';
import University from './pages/University/University'

function App() {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/university/:uniName" element={<University />} />
      </Routes>


    </div>
  )
}

export default App
