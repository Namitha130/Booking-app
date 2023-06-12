import { Link } from "react-router-dom";

const Navbar = () => {
    return ( 
        <nav>
            <div id="logo">
                <Link to="/home"> <i class='bx bxs-bus bx-burst' ></i> </Link>
            </div>
            <div className="side-bar">
                <Link  to="/bus"> 
                <button> Bus </button>
                </Link>

                <Link to="/flight"> 
                <button> Flight </button>
                </Link>

                <Link to="/active"> 
                <button> Active Bookings </button>
                </Link>
                <Link to="/profile"> 
                <button> Profile </button>
                </Link>
                
            </div>
            
        </nav>
     );
}
 
export default Navbar;