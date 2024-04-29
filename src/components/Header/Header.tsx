import { useEffect } from "react";
import logo from "../../assets/logo.png"
import "./header.css"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { PublicKey } from "@solana/web3.js";
import { Ranking, useWalletContext } from "../../contexts/WalletContext";
import { useConnection } from "@solana/wallet-adapter-react";

function Header() {
    const { setRanking } = useWalletContext();
    const location = useLocation();
    useEffect(()=>{
        // Chamada para buscar as maiores transferências com paginação
        fetch("https://glask-api.onrender.com/api/ranking").then(response=>response.json()).then((data:Ranking)=>{
            setRanking(data)
        })
    },[])
    return (
        <header>
            <div className="container">
                <nav>
                    <ul>
                        <li>
                            <Link target="_blank" to="/">$glask</Link>
                        </li>
                        <span>|</span>
                        <li>
                            <Link className={location.pathname === '/' ? 'active_link' : ''} to="/">home</Link>
                        </li>
                        <span>|</span>
                        <li>
                            <Link className={location.pathname === '/allocation' ? 'active_link' : ''} to="/allocation">allocation</Link>
                        </li>
                        <span>|</span>
                        <li>
                            <Link target="_blank" to="/">whitepaper</Link>
                        </li>
                        <span>|</span>
                        <li>
                            <Link target="_blank" to="/">telegram</Link>
                        </li>
                        <span>|</span>
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