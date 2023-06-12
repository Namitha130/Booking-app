import { useEffect } from "react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Signup = () => {

        let username =useRef();
        let email =useRef();
        let phone =useRef();
        let password =useRef();
        let address =useRef();
        let dob =useRef();
        let confirmPassword = useRef();
        let [verified,setverified] = useState(false);
        let navigate=useNavigate();
 
        useEffect( ()=>{
            //verigy user has authenticated already. if yes redirect to home
            if(localStorage.getItem("userdetails") !== null)
            {
                navigate("/home");
            }
        },[])

        let verifyEmail =() =>{
            setTimeout(()=>{
                setverified(true)
                
            },2000)
        }
        
let handleSignup  = (e) => {
       // stop auto refresh
        e.preventDefault();

        // validate some values
        if (password.current.value !== confirmPassword.current.value) 
        {
            alert("Password Mismatch")
            return
        }
        if (new Date() < new Date(dob.current.value)) {
            alert("Tnvalid birth date")
            return
        }

        // create an obj of new user to send 
            let newUser = {
                username: username.current.value,
                email: email.current.value,
                phone: phone.current.value,
                password: password.current.value,
                confirmPassword : confirmPassword.current.value,
                address: address.current.value,
                dob: dob.current.value,
                active_bookings : [],
               
            }

            let options = document.getElementsByName("gender");
            for (let i = 0; i < options.length; i++) {
                if (options[i].checked)
                {
                    newUser.genders = options =[i].value;
                }
                
            }         
            console.log(newUser);

             // post the obj to the db collection
            fetch("http://localhost:4010/users" ,
            {
                method: "POST",
                headers : {"Content-Type" : "application/json"},
                body: JSON.stringify(newUser)
            })
            .then(()=>{
                alert("Your successfully created an account");
                navigate("/login");
            })       
}
    return ( <div>
       <div className="signup-form">
        <h1>Signup</h1>
            <hr/>
        <form onSubmit={handleSignup}>
        
            <input type="text" placeholder="Username" ref={username} required />
            <input type="email" placeholder="Email address" ref={email} required/>
            <input type="password" placeholder="Password" ref={password} required/> 
            <input type="text" placeholder="Confirm Password" ref={confirmPassword} required/> 
            <input type="tel" placeholder="Phone number" ref={phone} maxlength="10" minlength="10" required/>
          
            <input type="date" placeholder="Date of Birth" ref={dob} required/>
            
            <input type="text" placeholder="Address" ref={address} required/>

            <input type="submit" value="Sign-up" disabled ={verified == false ? true :false}/>
        </form>
        <span>verify email to submit the form</span>
        <br/>
              <button onClick={verifyEmail}>
                    Verify email
              </button>  
             
               <p> Already have an account? <Link to="/login"> Login </Link></p>
    </div> 
    </div> );
}
 
export default Signup;