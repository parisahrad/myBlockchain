import { Transaction } from "./transaction";

export class Block {
  index: number;
  transactions: Transaction[];
  nonce: number;
  hash: string;
  prevHash: string;

  constructor() {
    this.index = 0;
    this.transactions = [];
    this.nonce = 0;
    this.hash = "";
    this.prevHash = "";
  }

  get key() {
    return JSON.stringify(this.transactions) + this.index + this.nonce;
  }

  addTransaction(transaction: Transaction) {
    this.transactions.push(transaction);
  }
}
