export function determineBlockchainConfig(blockchain) {
  let apiKey;
  let domain;

  if (blockchain === "ethereum") {
    domain = "https://api.etherscan.io";
    apiKey = process.env.ETHERSCAN_API_KEY;
  }

  if (blockchain === "polygon") {
    domain = "https://api.polygonscan.com";
    apiKey = process.env.POLYGONSCAN_API_KEY;
  }

  return {
    apiKey,
    domain,
  };
}
