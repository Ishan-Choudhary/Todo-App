import { ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import {Routes, Route} from "react-router-dom";


import SignupCard from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

const App = () => {

  const [logggedIn, setLoggedIn] = useState(false);

  return (
    <ChakraProvider> 
      <Routes>
        <Route path="/signup" element={<SignupCard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={logggedIn || sessionStorage.getItem("auth_token") ? <Dashboard loggedInFn={setLoggedIn}/> : <Login loggedInFn={setLoggedIn}/>} />
      </Routes>
    </ChakraProvider>
  )
}

export default App;