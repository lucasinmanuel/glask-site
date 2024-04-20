import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// Função para buscar transações com as maiores transferências
export default async function getTopTransfers(connection:Connection,publicKey:PublicKey,limit:number,before:string|undefined) {
    try {
        if(publicKey == null){
          return []
        }
        const transactions = await connection.getConfirmedSignaturesForAddress2(
            publicKey, // Endereço padrão para obter todas as transações confirmadas
            {
                limit: limit, // Limite de transações para buscar
                before: before
            },
            "confirmed"
        );

        const totalPorCarteira = new Map();
  
        // Iterar sobre as transações
        for (const signature of transactions) {
            const tx = await connection.getTransaction(signature.signature,{commitment:"confirmed",maxSupportedTransactionVersion:1});
            
            // // Endereço da carteira remetente
            const remetente = tx?.transaction.message.getAccountKeys().get(0)?.toBase58();
            
            // // Valor transferido na transação (em lamports)
            const a = tx?.meta?.postBalances[1];
            const b = tx?.meta?.preBalances[1];
            
            let valorTransferido = 0;
            if(a != undefined && b != undefined){
              valorTransferido = (a - b) / LAMPORTS_PER_SOL;
            }
  
            // Atualizar o total de valor para a carteira remetente
            if (totalPorCarteira.has(remetente)) {
                totalPorCarteira.set(remetente, totalPorCarteira.get(remetente) + valorTransferido);
            } else {
                totalPorCarteira.set(remetente, valorTransferido);
            }
        }
        
        // Converter o mapa em um array de objetos [carteira, total]
        const totalArray = Array.from(totalPorCarteira, ([carteira, total]) => ({ carteira, total }));
  
        // Classificar o array com base no total (do maior para o menor)
        const ranking = totalArray.sort((a, b) => b.total - a.total);
        
        return ranking;
    } catch (error) {
        console.error("Erro ao buscar transações:", error);
        throw error;
    }
  }