import { useWalletContext } from "../../contexts/WalletContext";

require("./allocation.css");

function Allocation() {
  const { ranking } = useWalletContext();
  console.log(ranking)
  return (
    <main>
        <div className="container">
            <div>Allocation</div>
        </div>
    </main>
  );
}

export default Allocation;