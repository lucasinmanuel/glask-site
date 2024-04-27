import ReactPaginate from "react-paginate";
import { useWalletContext } from "../../contexts/WalletContext";
import { IconContext } from "react-icons";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";

require("./allocation.css");

const Allocation = () => {
    const { ranking, WALLET_ADDRESS_FOR_DONATION } = useWalletContext();

    const handlePageClick = (data: any)=>{
      console.log(data)
    }

    return (
        <div className="container alloction">
            <h2>Ranking (os dados são atualizados a cada 24 horas)</h2>
            <h5>Transactions for {WALLET_ADDRESS_FOR_DONATION}</h5>
            <div style={{overflow:"auto"}}>
              <table>
                  <thead>
                      <tr>
                          <th>Wallet Address</th>
                          <th>Total (SOL)</th>
                      </tr>
                  </thead>
                  <tbody>
                      {ranking?.transactions.map((tx, index) => (
                          <tr key={index}>
                              <td>{tx.carteira}</td>
                              <td>{tx.total}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
            </div>
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
    );
};



export default Allocation;