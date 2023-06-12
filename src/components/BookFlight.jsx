import { useState ,useRef, useEffect} from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const BookFlight = () => {
    let [from , setFrom] = useState("");
    let [to,setTo] = useState("");
    let date = useRef();

    let [searchedFlight,setSearchedFlight] = useState(null);
    let[startpoints , setstartpoints] = useState(null);
    let[endpoints , setendpoints] = useState(null);

    useEffect ( () => {
        fetch("http://localhost:5000/flight")
        .then( (res) =>{ return res.json()})
        .then((allFlights) => {
            // console.log(allFlights);
            let s = allFlights.map((flight)=>{return flight.from})
            let sp = s.filter((v,i,a)=> { return (!a.includes(v ,i+1))})
            setstartpoints(sp)

            let e = allFlights.map((flight)=>{return flight.to})
            let ep = e.filter((v,i,a)=> { return (!a.includes(v ,i+1))})
            setendpoints(ep)
        })
    },[])

let handleSearchFlights = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/flight")
    .then( (res) =>{ return res.json()})
    .then ( (allFlights) =>{
        let filteredFlight = allFlights.filter( (flight)=>{
            return (flight.from.includes(from)) &&
            (flight.to.includes(to))
        });
        setSearchedFlight(filteredFlight);
    })
    localStorage.setItem("bookingdate",JSON.stringify(date.current.value))
}
return ( 
    <div className="book-flight">
    <Navbar/>
        <div className="inputs">
            <h1> Search for the destination</h1>
            <form onSubmit={handleSearchFlights} >
            <input type="text" placeholder="From" required 
                    value={from} onChange={(e) => {setFrom(e.target.value)}}/>
                {    startpoints &&
                    <div className="start-points">
                    {
                        startpoints.map( (start)=>{return (
                            <>{start.includes(from) && <span key={start} onClick={()=>{setFrom(start)}}>{start}</span>}</>
                        )})   
                    }
                    </div>
                }

            <input type="text" placeholder="To" required
                    value={to} onChange={(e)=>{setTo(e.target.value)}}/>
                    {   endpoints && 
                    <div className="end-points">
                        {
                        endpoints.map((end)=>{return(
                        <>{end.includes(to) && <span key={end} onClick={()=>{setTo(end)}}>{end}</span>}</>
                        )})
                        }
                    </div>
                }
            <input type="date" ref={date}/>
                    
            <input type="submit" value="Search flight"/>
            </form>
        </div>
        
        {
            searchedFlight && <div className="flight-list">
                <h3>Journey from {from} to {to} </h3>
                {
                    searchedFlight.length>0 ? <div className="flight-table">
                        <div className="header">
                            <span>Flight</span>
                            <span>Available</span>
                            <span>Departure</span>
                            <span>Arrival</span>
                            <span>Duration</span>
                        </div>
                        <div className="body">
                        {
                            searchedFlight.map((flight)=>{
                                return(
                                    <div>
                                        <span>{flight.flightname}</span>
                                    <div> 
                                        <span>{flight.seats - flight.booked_seats} / </span>
                                        <span>{flight.seats}</span> 
                                    </div>
                                    <div>
                                        <span> {date.current.value} </span>
                                        <span> {flight.start} </span>
                                    </div>
                                    <div>
                                        <span> {date.current.value} </span>
                                        <span> {flight.end} </span>
                                    </div>
                                    <div>
                                        <span>{flight.journey_time}</span>
                                        <Link to={`/flightdetail/${flight.id}`}><button>Book ticket</button></Link>
                                    </div>
                                    </div>)
                            })
                        }
                        </div>
                    </div>:
                    <h1>OOOPS!!! No Flights availbale for the given destination.</h1>
                }

            </div>
        }
            
        
    </div>
     );
}
 
export default BookFlight;