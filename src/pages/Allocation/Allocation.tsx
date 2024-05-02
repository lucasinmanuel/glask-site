import ReactPaginate from "react-paginate";
import { useWalletContext } from "../../contexts/WalletContext";
import { IconContext } from "react-icons";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { useEffect, useState } from "react";

require("./allocation.css");

const Allocation = () => {
    const { ranking, WALLET_ADDRESS_FOR_DONATION } = useWalletContext();
    const [currentPage,setCurrentPage] = useState<any[]>([]);
    useEffect(()=>{
      if(ranking){
        const transactions = ranking.transactions;
        if(transactions){
          setCurrentPage(transactions.slice(0,10));
        }
      }
    },[ranking]);
    const handlePageClick = (pageNumber: any)=>{
      // Calcular o índice inicial e final dos itens da página atual
      let startIndex;
      if(startIndex != 0){
        startIndex = pageNumber * 10;
      }else{
        startIndex = (pageNumber - 1) * 10;
      }
      const endIndex = startIndex + 10;
      const page = ranking?.transactions.slice(startIndex,endIndex);
      if(page){
        setCurrentPage(page);
      }
    }
    return (
        <div className="container alloction">
            <div className="allocation_background">
              <h2>Ranking (data is updated every 24 hours)</h2>
              <h5>Transactions for 9JPUx1twRU63V1***************sPrJB3uViK</h5>
            </div>
            <div className="allocation_background_table" style={{overflow:"auto"}}>
              <table>
                  <thead>
                      <tr>
                          <th>Wallet Address</th>
                          <th>Total (SOL)</th>
                      </tr>
                  </thead>
                  <tbody>
                      {currentPage.map((tx, index) => {
                        return tx.carteira != "9JPUx1twRU63V1***************sPrJB3uViK" &&
                           <tr key={index}>
                              <td>{tx.carteira}</td>
                              <td>{tx.total}</td>
                          </tr>
                        
                      })}
                  </tbody>
              </table>
            </div>
            <div className="allocation_background">
              <ReactPaginate
                containerClassName={"pagination"}
                pageClassName={"page-item"}
                activeClassName={"active"}
                onPageChange={(event) => handlePageClick(event.selected)}
                pageCount={ranking?.totalPages||0}
                breakLabel="..."
                previousLabel={
                  <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
                    <AiFillLeftCircle />
                  </IconContext.Provider>
                }
                nextLabel={
                  <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
                    <AiFillRightCircle />
                  </IconContext.Provider>
                }
              />
            </div>
        </div>
    );
};



export default Allocation;