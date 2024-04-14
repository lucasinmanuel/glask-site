import logo from "../../assets/logo.png"
import "./header.css"
import { Outlet, Link } from "react-router-dom"

function Header() {
  return (
    <header>
        <div className="container">
            <img src={logo} alt="logo" className="logo" />
            <nav>
                <ul>
                    <li>
                        <Link target="_blank" to="/">$glask</Link>
                    </li>
                    <li>
                        <Link to="/">home</Link>
                    </li>
                    <li>
                        <Link to="/allocation">allocation</Link>
                    </li>
                    <li>
                        <Link target="_blank" to="/">whitepaper</Link>
                    </li>
                    <li>
                        <Link target="_blank" to="/">telegram</Link>
                    </li>
                    <li>
                        <Link target="_blank" to="/">twitter</Link>
                    </li>
                </ul>
            </nav>
        </div>
        <Outlet />
    </header>
  );
}

export default Header;