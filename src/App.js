import NavBar from "./component/NavBar";
import {Outlet} from "react-router-dom";
import './index.css';

function App() {
    return (
        <div className="container mb-5">
            <NavBar/>
            <Outlet/>
        </div>
    );
}

export default App;
