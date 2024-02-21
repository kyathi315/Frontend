import logo from './logo.svg';
import './App.css';
import Login from './Components/Login';
import Student from './Components/Student';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './Components/SignUp';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <div>
    <ToastContainer/>
    <BrowserRouter> 
      <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path="/Student" element={<Student/>}></Route>
      <Route path="/SignUp" element={<SignUp/>}></Route>
      </Routes>
      </BrowserRouter>  
    </div>
  );
}

export default App;
