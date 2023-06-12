import { useState,useEffect } from "react";
import Navbar from "./Navbar";

const ActiveBooking = () => {
    let [userdetails,setUserDetails]= useState(null);

    useEffect ( ()=>{
        let userdetails = JSON.parse(localStorage.getItem("userdetails"));
        setUserDetails(userdetails)
    },[])
    return (  
    <div>
        <Navbar/>
        <h1>Active Bookings</h1>
        {   userdetails && 
            <div className="active-booking"> 
            {  userdetails.active_bookings.map((ticket)=>{
                    return(
                    <div className="ticket">
                        <div>
                        {/* <p>{i+1}</p> */}
                            <h3>Name: <p>{userdetails.username} </p></h3>
                            <h3>Email-Id: <p>{userdetails.email} </p></h3>
                            <h3>Contact-number: <p>{userdetails.phone} </p></h3>
                            <h3>Address: <p>{userdetails.address} </p></h3>
                        </div>
                             
                    <div>
                    {
                        ticket.flightname ?
                        <h3> Flight : <p> {ticket.flightname} - {ticket.flight_no} </p> </h3>
                        :
                        <h3> Bus : <p> {ticket.busname} - {ticket.busnumber} </p> </h3>
                    }
                    <h3> Date: <p>{ticket.date}</p></h3>
                    <h4>{ticket.from} : {ticket.start} -- {ticket.to} : {ticket.end}</h4> 
                    <h3> Seats Booked: <p> {ticket.seats}</p> </h3>
                    </div>

                    </div>
                )
            })
            }
            </div>
        }
        </div>
    );
}
 
export default ActiveBooking;