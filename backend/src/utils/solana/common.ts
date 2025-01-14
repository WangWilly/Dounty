import { clusterApiUrl, Connection } from "@solana/web3.js";

////////////////////////////////////////////////////////////////////////////////

export function parseConnectionEndpoint(endpoint: string): string {
  const cluster = endpoint.toLowerCase();

  switch (cluster) {
    case 'mainnet':
      return clusterApiUrl('mainnet-beta');
    case 'testnet':
      return clusterApiUrl('testnet');
    case 'devnet':
      return clusterApiUrl('devnet');
    default:
      return endpoint;
  }
}

export function createConnection(endpoint: string): Connection {
  const connection = new Connection(parseConnectionEndpoint(endpoint), 'confirmed');
  return connection;
}