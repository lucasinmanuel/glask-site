import { Outlet, Link } from "react-router-dom"

function Header() {
  return (
    <header>
        <div className="container">
            <img src="" alt="logo" />
            <nav>
                <ul>
                    <li>
                        <Link to="/">allocation</Link>
                    </li>
                    <li>
                        <Link target="_blank" to="/">$glask</Link>
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