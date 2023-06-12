import './App.css';
import {BrowserRouter,Routes ,Route} from 'react-router-dom';

import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import Protect from './components/Protect';
import Bookbus from './components/Bookbus';
import BusDetail from './components/BusDetail';
import ActiveBooking from './components/ActiveBooking';
import BookFlight from './components/BookFlight'
import FlightDetail from './components/FlightDetail';
function App() {
  return (
    <BrowserRouter>
     <div className="App">
     
      <Routes>
         
          <Route path='/' element={<Signup/>}/>
          <Route path='/login' element={<Login/>} />
          <Route path='/home' element={ <Protect Child={Home}/>  }/>
            <Route path='/profile' element={ <Protect Child={Profile}/>  }/>
            <Route path='/bus' element={<Protect Child={Bookbus}/>}/>
            <Route path='/busdetail/:busid' element={<Protect Child={BusDetail}/>}/>
            <Route path='/active' element={<Protect Child={ActiveBooking}/>}/>
            <Route path='/flight' element= { <Protect Child={BookFlight}/>} />
            <Route path='/flightdetail/:flightid' element={<Protect Child={FlightDetail}/>}/>
      </Routes>
      
    </div>
    </BrowserRouter>  
  );
}

export default App;
