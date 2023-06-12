import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    let email = useRef();
    let password = useRef();
    let navigate = useNavigate();

    let handleLogin = (e)=>{
            e.preventDefault();

         fetch("http://localhost:4010/users")
        .then((res)=>{return res.json()})
        .then( (data) =>{
            let user =data.find( (user)=>{
                    return user.email ===email.current.value
            });
            console.log(user);

            if(user === undefined)
            {
                alert("user not found");
            }
            else if(user.password !== password.current.value)
            {
                alert("invalid password");
            }
            else{
                alert("login successfull");
                localStorage.setItem("userdetails" , JSON.stringify(user));
                navigate("/home")
            }
        })
    }
    return ( 
        <div className="login-form">

            <h1>Login </h1>
            <hr/>
            <form onSubmit={handleLogin}>
                 <input type="email" placeholder="Email" ref={email} required/>
                 <input type="password" placeholder="Password" ref={password} required/>
                 
                <input type="submit" value="Login" />
            </form>
            <span>Dont have an account ?  </span> <br/>
            <Link to="/"><button>Create account</button></Link>
            
        </div>
     );
}
 
export default Login;