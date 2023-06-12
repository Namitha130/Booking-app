import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const Bookbus = () => {
    let [from , setFrom]  = useState("");
    let [to,setTo]  = useState("");
    let date = useRef();

    let[searchedBus , setSearchedBus] = useState(null);
    let[startpoints , setstartpoints] = useState(null);
    let[endpoints , setendpoints] = useState(null);

    useEffect(()=>{
        fetch("http://localhost:5000/bus")
        .then((res)=>{return res.json()})
        .then((allBus)=>{
            let s = allBus.map((bus)=>{return bus.from});
            let sp = s.filter((v,i,a)=>{ return (!a.includes(v , i+1))})
            setstartpoints(sp)

            let e = allBus.map((bus)=>{return bus.to});
            let ep = e.filter((v,i,a)=>{ return (!a.includes(v , i+1))})
            setendpoints(ep)
        })
    } , [])

    let handleSearchBuses = (e)=>{
        e.preventDefault();

        fetch("http://localhost:5000/bus")
        .then((res)=>{return res.json()})
        .then((allBus)=>{
            let filteredBus =  allBus.filter((bus)=>{ 
                                return (bus.from.includes( from)) &&
                                        (bus.to.includes(to)) 
                        });
            setSearchedBus(filteredBus);
        })
        localStorage.setItem("bookingdate",JSON.stringify(date.current.value))
    }
    return ( 
        <div className="book-bus">
            <Navbar/>
            <div className="inputs">
                <h1>Search for the destination</h1>
                <form onSubmit={handleSearchBuses}>
                    <input type="text" placeholder="From" required 
                    value={from} onChange={(e)=>{setFrom(e.target.value)}}/>
                    {   startpoints && 
                    <div className="start-points">
                        {
                        startpoints.map((start)=>{return(
                        <>{start.includes(from) && <span key={start} onClick={()=>{setFrom(start)}}>{start}</span>}</>
                        )})
                        }
                    </div>
                    }

                    <input type="text" placeholder="to" required
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

                    <input type="date"   ref={date}/>
                    <input type="submit" value="Search bus"/>
                </form>
            </div>

            {searchedBus && <div className="bus-list">
            <h3>Journey from {from} to {to} </h3>

            {searchedBus.length>0 ? <div className="bus-table">
                <div className="header">
                        <span>Bus</span>
                        <span>Available</span>
                        <span>Departure</span>
                        <span>Arrival</span>
                        <span>Duration</span>
                </div>
                <div className="body">
                {
                    searchedBus.map((bus)=>{
                        return(<div>
                                    <span>{bus.busname}</span>
                                    <div> 
                                        <span>{bus.seats - bus.booked_seats} / </span>
                                        <span>{bus.seats}</span> 
                                    </div>
                                    <div>
                                        <span> {date.current.value} </span>
                                        <span> {bus.start} </span>
                                    </div>
                                    <div>
                                        <span> {date.current.value} </span>
                                        <span> {bus.end} </span>
                                    </div>
                                    <div>
                                        <span>{bus.journey_time}</span>
                                        <Link to={`/busdetail/${bus.id}`}><button>Book ticket</button></Link>
                                    </div>
                                </div>)
                    })
                }
                </div>
                                    </div> : 
                                    <h1>No Busses found for the given destination !!!</h1>
                                    
        }

            </div>}


        </div>
    );
}
export default Bookbus;