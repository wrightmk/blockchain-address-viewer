import { determineBlockchainConfig } from "./utils";

export async function getAddress(address, blockchain) {
  const { apiKey, domain } = determineBlockchainConfig(blockchain);

  //   page=1&offset=10
  const res = await fetch(
    `${domain}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`,
    {
      next: { revalidate: 10 },
    }
  );

  const data = await res.json();
  return data;
}

export async function getAmount(address, blockchain) {
  const { apiKey, domain } = determineBlockchainConfig(blockchain);

  const res = await fetch(
    `${domain}/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`,
    {
      next: { revalidate: 10 },
    }
  );

  const data = await res.json();
  return data;
}

export async function getTx(tx, blockchain) {
  const { apiKey, domain } = determineBlockchainConfig(blockchain);

  const res = await fetch(
    `${domain}/api?module=proxy&action=eth_getTransactionByHash&txhash=${tx}&apikey=${apiKey}`,

    {
      next: { revalidate: 10 },
    }
  );

  const data = await res.json();
  return data;
}

export async function getTxReceipt(tx, blockchain) {
  const { apiKey, domain } = determineBlockchainConfig(blockchain);

  const res = await fetch(
    `${domain}/api?module=proxy&action=eth_getTransactionReceipt&txhash=${tx}&apikey=${apiKey}`,

    {
      next: { revalidate: 10 },
    }
  );

  const data = await res.json();
  return data;
}

export async function getTxStatus(tx, blockchain) {
  const { apiKey, domain } = determineBlockchainConfig(blockchain);

  const res = await fetch(
    `${domain}/api?module=transaction&action=gettxreceiptstatus&txhash=${tx}&apikey=${apiKey}`,

    {
      next: { revalidate: 10 },
    }
  );

  const data = await res.json();
  return data;
}

export async function getTxBlock(blockNumber, blockchain) {
  const { apiKey, domain } = determineBlockchainConfig(blockchain);

  const res = await fetch(
    `${domain}/api?module=proxy&action=eth_getBlockByNumber&tag=${blockNumber}&boolean=true&apikey=${apiKey}`,

    {
      next: { revalidate: 10 },
    }
  );

  const data = await res.json();
  return data;
}
