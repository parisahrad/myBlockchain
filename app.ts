import { Block } from "./block";
import { Blockchain } from "./blockchain";
import { Transaction } from "./transaction";
const express = require("express");

const app = express();

app.use(express.json());

app.get("/blockchain", (req: any, res: any) => {
  const genesisBlock = new Block();
  const blockchain = new Blockchain(genesisBlock);

  const trx = new Transaction("test1", "test2", 100);

  const nextBlock = blockchain.getNextBlock([trx]);
  blockchain.addBlock(nextBlock);

  const trx2 = new Transaction("test1", "test2", 1100);

  const nextBlock2 = blockchain.getNextBlock([trx2]);
  blockchain.addBlock(nextBlock2);

  res.json(blockchain);
});

app.listen(8765, () => {
  console.log("server is running...");
});
