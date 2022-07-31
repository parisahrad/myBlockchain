import { Block } from "./block";
import { Blockchain } from "./blockchain";
import { BlockchainNode } from "./blockchainNode";
import { Transaction } from "./transaction";
const _ = require("lodash");
const express = require("express");
const fetch = require("node-fetch");

const app = express();

let PORT = 8765;

let terminalArguments = process.argv;

if (terminalArguments.length > 2) {
  PORT = parseInt(terminalArguments[2]);
}

app.use(express.json());

const genesisBlock = new Block();
let transactions: Transaction[] = [];
const allTransactions: Transaction[] = [];
let blockChain: Blockchain = new Blockchain(genesisBlock);
let nodes: BlockchainNode[] = [];

app.get("/resolve", (req: any, res: any) => {
  nodes.forEach((node) => {
    fetch(`${node.url}/blockchain`)
      .then((response: any) => response.json())
      .then((otherBlockchain: any) => {
        if (blockChain.blocks.length < otherBlockchain.blocks.length) {
          allTransactions.forEach((trx) => {
            fetch(`${node.url}/transactions`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(trx),
            })
              .then((response: any) => response.json())
              .then((_: any) => {
                fetch(`$node.url/mine`)
                  .then((response: any) => response.json())
                  .then((_: any) => {
                    fetch(`${node.url}/blockchain`)
                      .then((response: any) => response.json())
                      .then((updatedBlockchain: Blockchain) => {
                        blockChain = updatedBlockchain;
                      });
                  });
              });
          });
        }
      });
  });
});

app.post("/nodes/register", (req: any, res: any) => {
  const urls: string[] = req.body.urls;

  urls.forEach((url) => {
    const node = new BlockchainNode(url);
    nodes.push(node);
  });

  res.json(nodes);
});

app.post("/transaction", (req: any, res: any) => {
  const { from, to, amount } = req.body;

  const trx = new Transaction(from, to, amount);

  transactions.push(trx);
  res.json(trx);
});

app.get("/blockchain", (req: any, res: any) => {
  res.json(blockChain);
});

app.post("/mine", (req: any, res: any) => {
  const block = blockChain.getNextBlock(req.body.transactions);
  blockChain.addBlock(block);

  transactions.forEach((trx) => {
    allTransactions.push(trx);
  });

  transactions = [];

  res.json(blockChain);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}...`);
});
