import { Block } from "./block";
import { sha256 } from "js-sha256";
import { Transaction } from "./transaction";

export class Blockchain {
  blocks: Block[];
  constructor(genesisBlock: Block) {
    this.blocks = [];
    this.addBlock(genesisBlock);
  }

  addBlock(block: Block) {
    if (block.transactions.length === 0) {
      block.prevHash = "0000000000000000";
      block.hash = this.generateHash(block);
    }

    this.blocks.push(block);
  }

  getNextBlock(transactions: Transaction[]) {
    let block = new Block();

    transactions.forEach((trx) => {
      block.transactions.push(trx);
    });

    let prevBlock = this.blocks[this.blocks.length - 1];

    block.prevHash = prevBlock.hash;
    block.index = this.blocks.length;
    block.hash = this.generateHash(block);

    return block;
  }

  getPreviousBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  generateHash(block: Block) {
    let hash = sha256(block.key);

    while (!hash.startsWith("0000")) {
      block.nonce += 1;
      hash = sha256(block.key);
    }
    return hash;
  }
}
