import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { useState } from "react";
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

const BusDetail = () => {
    let [userdetails ,setUserdetails] = useState({});
    let[bookingdate , setbookingdate] = useState("");
    let[bus , setBus] = useState(null);
    let[seats , setSeats] = useState(1);
    let navigate = useNavigate();
    let {busid} = useParams();
    let [loading, setLoading] = useState(true);
 
        let toaster = new ToasterUi();

    useEffect(()=>{
       setTimeout (() =>{

        fetch("http://localhost:5000/bus/"+busid)
        .then((res)=>{return res.json()})
        .then((bus)=>{
            setBus(bus);
            setLoading(false);
        })
       },2000)
      let data = JSON.parse(localStorage.getItem("userdetails"));
      setUserdetails(data);

      let date = JSON.parse(localStorage.getItem("bookingdate"));
      setbookingdate(date);

    } , [busid])

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

//once user pay, ticket will be added into active account
let handleBookticket = () =>{
// 1) add ticket obj to active_booking key in user obj  [PUT]
  let  busTicket ={
        busname :bus.busname,
        busnumber:bus.busnumber,  
        seats: seats,
        from: bus.from,
        to:bus.to,
        start: bus.start,
        end:bus.end,
        journey_time:bus.journey_time,
        price:bus.price* seats,
        date: bookingdate
  }

  let UpdatedData = {
              ...userdetails , 
              active_bookings : [...userdetails.active_bookings,busTicket]
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
  // 2) increament the booked_seats value to prv + booked seats of current user [PUT]

  let updatedBusdata = {...bus , booked_seats: Number(bus.booked_seats) + Number(seats)}

  let busConfig = {
    method : "PUT",
            headers : {"Content-Type":"application/json"},
            body : JSON.stringify( updatedBusdata )
  }

  fetch("http://localhost:5000/bus/" + busid,busConfig)
  .then ( () =>{
    toaster.addToast("Ticket confirmed, Verify once in profile");
    closeModal();
    navigate("/profile")
  })
  // Reviews
}

    return ( 
        <div className="bus-details" style={{textAlign:"left"}}>
            <Navbar/>

            { loading &&
              <BeatLoader color=" #8c000f" loading={loading} 
              
              />
            }

            {bus && 
            <div>
                <div>
                    <h3>Journey from <span>{bus.from}</span> to <span>{bus.to}</span> </h3>
                    <h2>{bus.busname}- {bus.type}</h2>
                    <p>{bus.busnumber}</p>
                    <p>Total capacity : {bus.seats} </p>
                    <p>Available Seats: {bus.seats - bus.booked_seats} </p>
                    <p>Boarding : <span>{bus.from} - {bus.start}</span></p>
                    <p>Destination : <span>{bus.to} - {bus.end}</span></p>
                    <p className="price">{bus.price} Rupees  / ticket  </p>
                    <input type="number" min="1" max={bus.seats - bus.booked_seats}
                    value={seats} onChange={(e)=>{setSeats(e.target.value)}}/>
                    <h2>Total Price - <span>{seats * bus.price}</span>  </h2>
                    <button className="ticket-btn" onClick={openModal}>Book ticket</button>
                </div>
                <div className="bus">
                </div>    
            </div>
            }
               
            { bus &&    <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    >
                    <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Passenger :{userdetails.username} </h2>
                    <p> {userdetails.phone}</p>
                    <p>{bus.busname} - {bus.busnumber} </p>
                    <p>Date : {bookingdate}</p>
                    <p>{bus.from} - {bus.start}  to {bus.to} - {bus.end} </p>
                    <p>Seats selected : {seats}  - Total Amount {seats*bus.price} &#8377; </p>
                    <input type="number" placeholder="Enter amount in rupees" value={seats*bus.price}/>
                    <button onClick={handleBookticket}>Pay</button>
                    
                </Modal> 
            }
        </div>
    );
}
export default BusDetail;