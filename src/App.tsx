import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';

import Home from "./pages/home";
import FreshSnowStations from "./pages/fresh_snow_stations";
import FreshSnowMap from "./pages/fresh_snow_map";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import AvalancheTerrainMaps from "./pages/avalanche_terrain_maps";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/aboutme' element={<p>työn alla</p> } />
        <Route path='/freshsnow'>
          <Route path='' element={<FreshSnowStations />}/>
          <Route path='map' element={<FreshSnowMap />}/>
        </Route>
        <Route path='/avalanche_terrain_maps' element={<AvalancheTerrainMaps /> } />
        <Route path='*' element={<p>not found</p> } />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;