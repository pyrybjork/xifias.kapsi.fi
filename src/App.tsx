import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';

import Home from "./pages/home";
import FreshSnowStations from "./pages/fresh_snow_stations";
import FreshSnowMap from "./pages/fresh_snow_map";
import Navigation from "./components/navigation";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<p>coming soon</p> } />
        <Route path='/freshsnow'>
          <Route path='' element={<FreshSnowStations />}/>
          <Route path='map' element={<FreshSnowMap />}/>
        </Route>
        <Route path='*' element={<p>not found</p> } />
      </Routes>
    </Router>
  );
}

export default App;