import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import ToasterUi from 'toaster-ui';
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

const Profile = () => {

    let [userdetails,setUserDetails]= useState(null);
    let navigate = useNavigate();

    let toaster = new ToasterUi();

    useEffect ( ()=>{
        let userdetails = JSON.parse(localStorage.getItem("userdetails"));
        setUserDetails(userdetails)
    },[])

    //handle Logout 
    let handleLogout = ()=>{  
        localStorage.removeItem("userdetails");
        // alert("Logout successfully")
        toaster.addToast("Logout successfully")
     // window.location.href = "/login"
        navigate("/login");
    }
        
    //delete user account
    let handleDeleteAccount = ()=>{
        let pwd = prompt("are you sure want to delete , if yes please provide password");     
        if(pwd !== userdetails.password){
            alert("Invalid password");
            return
        }

    // delete the same user object {} from the users [] collect 
    let config = {method :"DELETE"};
    fetch("http://localhost:4010/users/" +userdetails.id ,config)
    .then(()=>{
          // navigate to signup page
        localStorage.removeItem("userdetails")
        alert("Your account has been deleted Successfully");
        navigate("/")
    })
    }
// ! ---------for active Booking button pop-up
  let subtitle;
  const [ActiveModalIsOpen, setActiveIsOpen] = useState(false);
   const [EditModalIsOpen, setEditIsOpen] = useState(false);

  function openActiveModal() {
    setActiveIsOpen(true);
  }

  function afterOpenActiveModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeActiveModal() {
    setActiveIsOpen(false);
  }
// ! ---------for edit button pop-up
  function openEditModal() {
    setEditIsOpen(true);
  }

  function afterOpenEditModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeEditModal() {
    setEditIsOpen(false);
  }
    return (
    <div className="profilepage">
        <Navbar/>
        <section className="section">
            <div className="coverphoto">
                <img src="https://www.pngmart.com/files/17/Travel-PNG-Transparent-Image.png" alt="" className="coverpic"/>
            </div>
            <img  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" className="profile-img" />
           
            { userdetails &&
                    <div className="container-top">
                        <div className="info">
                            <h1 >{userdetails.username}</h1>
                            {/* <p>{userdetails.phone}</p> */}
                        </div>
                        <div className=" right-button">
                            <button onClick={handleLogout} id="logout">Logout</button>
                            <button onClick={handleDeleteAccount} id="dlt-btn">Delete account</button>
                        </div> 
                    </div>
                    
            }

            { userdetails &&   
            <div className="user-details">
              <button className="edit" onClick={openEditModal}> Edit</button>
             
                                  
                <div className="details-box">
                         
                            <fieldset>
                                <legend>Email address</legend>
                                <p>{userdetails.email}</p>
                            </fieldset>
                            <fieldset>
                                <legend>Contact-number</legend>
                                <p> {userdetails.phone}</p>
                            </fieldset>
                            <fieldset>
                                <legend>Password</legend>
                                <p> {userdetails.password}</p>
                            </fieldset>
                            <fieldset>
                                <legend>Date of Birth</legend>
                                <p> {userdetails.dob}</p>
                            </fieldset>
                            <fieldset>
                                <legend> Address</legend>
                                <p> {userdetails.address}</p>
                            </fieldset>
                            <fieldset>
                                <legend>Total booking</legend>
                                <p> {userdetails.active_bookings.length}</p>
                            </fieldset>

                 </div>
                <div className="last-sec">
                    <button id="act-ticket" onClick={openActiveModal}> Active Ticket </button> 
                </div> 

                {/*  active booking modal */}
                { userdetails &&
                  <Modal
                  isOpen={ActiveModalIsOpen}
                  onAfterOpen={afterOpenActiveModal}
                  onRequestClose={closeActiveModal}
                  style={customStyles}
                  contentLabel="Example Modal"
                  >
                  <h2 ref={(_subtitle) => (subtitle = _subtitle)} className="modal-heading">Active Bookings</h2>
                  <div className="active-ticket-card">
                  {
                    userdetails.active_bookings.map((ticket ,i)=>{
                        return(
                            <div className="ticket">
                                <p>{i+1}</p>
                                <p>Bus : {ticket.busname} - {ticket.busnumber} </p>
                                <p>Date:{ticket.date}</p>
                                <p>{ticket.from}:{ticket.start} - {ticket.to}:{ticket.end}</p>
                                <p> Seats Booked:{ticket.seats}</p>
                            </div>
                        )
                    })
                  }
                  </div>
                  
                  <button onClick={closeActiveModal}>close</button>
                  </Modal>
                }
                {/* edit profile modal */}
              
                <Modal
                    isOpen={EditModalIsOpen}
                    onAfterOpen={afterOpenEditModal}
                    onRequestClose={closeEditModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    
                >
                    <h2 ref={(_subtitle) => (subtitle = _subtitle)} className="modal-heading" > Update your Profile</h2>
                  
                    
                    <form className="editFrom">

                        <input type="text" placeholder="Enter name"/>
                        <input type="email" placeholder="Enter email"/>
                        <input type="phone" placeholder="Enter phone number"/>
                        <input type="address" placeholder="Enter address"/>
                        <input type="dob" placeholder="Enter birth date"/>
                        <input type="submit" value= "Update"/>

                       
                    </form>
                </Modal>
                </div>
               
            }
        </section>
        
 
    </div>  );
}
 
export default Profile;