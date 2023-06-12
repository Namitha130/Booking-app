
import Navbar from "./Navbar";
import { useState ,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from 'react-modal';
import ToasterUi from 'toaster-ui';
import BeatLoader from "react-spinners/BeatLoader";

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  
const FlightDetail = () => {
    let [userdetails ,setUserdetails] = useState({});
    let[bookingdate , setbookingdate] = useState("");
    let [flight , setFlight] = useState(null)
   
    let[seats , setSeats] = useState(1);
    let navigate = useNavigate();
    let {flightid} =useParams();
    let [loading, setLoading] = useState(true);

    let toaster = new ToasterUi();
   useEffect( ()=>{
    setTimeout( ()=>{
        fetch("http://localhost:5000/flight/"+flightid)
        .then(res => res.json())
        .then ( (flight) =>{
            setFlight(flight)
            setLoading(false)
        })
        
    },2000)
    
    let data = JSON.parse(localStorage.getItem("userdetails"));
    setUserdetails(data);

    let date = JSON.parse(localStorage.getItem("bookingdate"));
    setbookingdate(date);
   },[flightid])

   let subtitle;
   const [modalIsOpen, setIsOpen] = useState(false);
 
   function openModal() {
     setIsOpen(true);
   }
 
   function afterOpenModal() {
     // references are now sync'd and can be accessed.
     subtitle.style.color = '#f00';
   }
 
   function closeModal() {
     setIsOpen(false);
   }

   let handleBookticket = () =>{
    let flightTicket = {
        flightname :flight.flightname,
        flight_no :flight.flight_no,
        seats: seats,
        from: flight.from,
        to:flight.to,
        start: flight.start,
        end:flight.end,
        journey_time:flight.journey_time,
        price:flight.price* seats,
        date: bookingdate

        }
        let UpdatedData = {
            ...userdetails , 
            active_bookings : [...userdetails.active_bookings,flightTicket]
        }

        let config = {
            method: "PUT",
            headers: {"Content-type":"application/json"},
            body :JSON.stringify(UpdatedData)
          }
        fetch("http://localhost:4010/users/"+ userdetails.id ,config)
        .then ( () =>{
            localStorage.setItem("userdetails" ,JSON.stringify(UpdatedData))
            
        })

        let updatedFlightData = {...flight , booked_seats : Number(flight.booked_seats) + Number(seats)}

        let flightConfig = {
            method :"PUT",
            headers : {"Content-Type":"application/json"},
            body : JSON.stringify( updatedFlightData )
        }
        setTimeout( ()=>{
            fetch("http://localhost:5000/flight/"+flightid,flightConfig)
            .then(()=>{
            toaster.addToast("Ticket confirmed, Verify once in profile");
            closeModal();
            navigate("/profile")
        })
        },2000)
        
   }
    return ( 
        <div className="flight-details" style={{textAlign:"left"}}>
            <Navbar/>
            { loading &&
              <BeatLoader color=" #8c000f" loading={loading}  />
            }
            { flight && 
                <div>
                    <div>
                        <h3>Journey from <span> {flight.from}</span> to <span>{flight.to}</span></h3>
                        <h2>{flight.flightname}</h2>
                        <p>{flight.flight_no}</p>
                        <p>Total capacity : {flight.seats} </p>
                        <p>Available Seats: {flight.seats - flight.booked_seats} </p>
                        <p>Boarding : <span>{flight.from} - {flight.start}</span></p>
                        <p>Destination : <span>{flight.to} - {flight.end}</span></p>
                        <p className="price">{flight.price} Rupees  / ticket  </p>
                        <input type="number" min="1" max={flight.seats -flight.booked_seats}
                        value={seats} onChange={(e)=>{setSeats(e.target.value)}}/>
                        <h2>Total Price - <span>{seats * flight.price}</span>  </h2>
                        <button className="ticket-btn" onClick={openModal}>Book ticket</button>
                    </div>
                    <div className="flight">
                        
                    </div>
                </div>
            }
            { flight &&    <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    >
                    <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Passenger :{userdetails.username} </h2>
                    <p> {userdetails.phone}</p>
                    <p>{flight.flightname} - {flight.flight_no} </p>
                    <p>Date : {bookingdate}</p>
                    <p>{flight.from} - {flight.start}  to {flight.to} - {flight.end} </p>
                    <p>Seats selected : {seats}  - Total Amount {seats*flight.price} &#8377; </p>
                    <input type="number" placeholder="Enter amount in rupees" value={seats*flight.price}/>
                    <button onClick={handleBookticket}>Pay</button>
                    
                </Modal> 
            }
        </div>
     );
}
 
export default FlightDetail;