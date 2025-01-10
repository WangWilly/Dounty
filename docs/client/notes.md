# Notes for Solana Client Development

## Next.js Solana Wallet Adapter Integration

Connecting your Next.js application to Solana involves integrating a Solana wallet adapter, which allows users to interact with their Solana wallets directly from your app. Here's a step-by-step guide: 
1. Create a Next.js Project
```bash
npx create-next-app@latest my-solana-app
```

2. Install Solana Wallet Adapter Dependencies 
```bash
cd my-solana-app
npm install @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/web3.js 
```

3. Set up Solana Wallet Adapter 

• Create a Wallet Context: Create a file like _app.js or context/WalletContext.js to wrap your application with the necessary providers. 

```ts
// _app.js
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);
const wallets = [new PhantomWalletAdapter()];

function MyApp({ Component, pageProps }) {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
```

4. Add a Connect Wallet Button 
```ts
// pages/index.js
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  const { connect, publicKey } = useWallet();

  return (
    <div>
      {publicKey ? (
        <p>Connected: {publicKey.toString()}</p>
      ) : (
        <button onClick={() => connect()}>Connect Wallet</button>
      )}
    </div>
  );
}
```

5. Utilize Wallet Context 
```ts
// pages/profile.js
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export default function Profile() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  // Use connection and publicKey to interact with the Solana blockchain
  // ...
}
```

6. Customize Wallet Adapter UI 
You can customize the look and feel of the wallet modal and other UI elements provided by @solana/wallet-adapter-react-ui. 

Generative AI is experimental.

[-] https://solana.stackexchange.com/questions/1657/solana-wallet-adaptor-autoconnecting-after-reload-change-page[-] https://solana.stackexchange.com/questions/1657/solana-wallet-adaptor-autoconnecting-after-reload-change-page[-] https://solana.stackexchange.com/questions/1657/solana-wallet-adaptor-autoconnecting-after-reload-change-page[-] https://solana.stackexchange.com/questions/1657/solana-wallet-adaptor-autoconnecting-after-reload-change-page

## MISC

- https://nextjs.org/docs/app/getting-started/project-structure#component-hierarchy
- https://nextjs.org/docs/app/getting-started/mutating-data

- https://medium.com/@zulfiqar.langah/how-to-setup-nest-js-next-js-mono-repository-8a5d8c3b5849
- https://phantom.com/
- https://stackoverflow.com/questions/59988667/typescript-react-fcprops-confusion
- 📌 https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md
- https://lorisleiva.com/create-a-solana-dapp-from-scratch/integrating-with-solana-wallets
- 📌 https://github.com/vercel/next.js/discussions/62861