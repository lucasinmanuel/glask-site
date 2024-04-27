import { useEffect } from "react";
import logo from "../../assets/logo.png"
import "./header.css"
import { Outlet, Link } from "react-router-dom"
import { PublicKey } from "@solana/web3.js";
import { Ranking, useWalletContext } from "../../contexts/WalletContext";
import { useConnection } from "@solana/wallet-adapter-react";

function Header() {
    const { setRanking } = useWalletContext();
    useEffect(()=>{
        // Chamada para buscar as maiores transferências com paginação
        fetch("https://glask-api.onrender.com/api/ranking").then(response=>response.json()).then((data:Ranking)=>{
            setRanking(data)
        })
    },[])
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