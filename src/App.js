
import Home from "./Components/Home"
import Weather from "./Components/Weather"
import Forecast from './Components/Forecast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/weather/:cityName" element={<Weather/>} />
      <Route path="/forecast/:lat/:lon" element={<Forecast/>} />
      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
