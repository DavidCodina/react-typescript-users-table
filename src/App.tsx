import React               from 'react';
import { useMainContext  } from './MainContext';
import { HashRouter }      from 'react-router-dom'; // HashRouter generally works better for GitHub, but normally use BrowserRouter.
import { Router }          from './components/navigation/Router';
import Navbar              from './components/navigation/Navbar';
import './scss/bootstrap/bootstrap-icons.css';
import './scss/bootstrap/custom-bootstrap.scss';
import './scss/App.scss';


function App(){
  const value = useMainContext();

  return (
    <HashRouter>
      <header><Navbar /></header>
      <main><Router value={value} /></main>
    </HashRouter>
  );
}


export default App;
