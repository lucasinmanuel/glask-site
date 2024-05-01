import { useEffect } from "react";
import "./header.css"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { PublicKey } from "@solana/web3.js";
import { Ranking, useWalletContext } from "../../contexts/WalletContext";
import logo from '../../assets/logo.png';
import logo2 from '../../assets/6X00IxsS_400x400.jpg';

function Header() {
    const { setRanking } = useWalletContext();
    const location = useLocation();
    useEffect(()=>{
        // Chamada para buscar as maiores transferências com paginação
        fetch("https://glask-api.onrender.com/api/ranking").then(response=>response.json()).then((data:Ranking)=>{
            setRanking({...data})
        })
    },[])
    return (
        <header>
            <div className="container">
                <div className="logo">
                    <img src={logo} width={64} style={{borderRadius:"50%"}} />
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link target="_blank" to="https://solscan.io/token/3f3ymZn3xXpMziVSeqKLRUqiXejWi5xRKAP2Lhw2yLBi">$glask</Link>
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
                            <Link target="_blank" to="https://glask-coin.gitbook.io/usdglask">whitepaper</Link>
                        </li>
                        <span>|</span>
                        <li>
                            <Link target="_blank" to="https://t.me/glaskcoinsol">telegram</Link>
                        </li>
                        <span>|</span>
                        <li>
                            <Link target="_blank" to="https://twitter.com/glaskcoinsol">twitter</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <Outlet />
        </header>
    );
}

export default Header;