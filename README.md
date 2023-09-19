# Privy PWA Demo

This is a template progressive web app (PWA) built with [Privy](https://www.privy.io/), [Viem](https://viem.sh/), [NextPWA](https://www.npmjs.com/package/next-pwa), and [TailwindCSS](https://tailwindcss.com/). All transactions are sent on the [Base](https://base.org/) Goerli testnet.

You can see the deployed version at [pwa.privy.io](https://pwa.privy.io/).

## Setup

First, clone this repo:

```sh
git clone https://github.com/privy-io/create-privy-pwa.git
```

Next, install dependencies, including `@privy-io/react-auth`, `viem`, and `next-pwa`:

```sh
pnpm i
```

Next, run `cp .env.example.local .env.local` to create your own env file, and add your Privy App ID:
```
NEXT_PUBLIC_PRIVY_APP_ID=insert-your-app-id
```

Lastly, run `npm run dev` and visit `http://localhost:3004` in your browser to see the PWA in action! For testing development on mobile, we recommend using `ngrok` ([guide](https://www.aleksandrhovhannisyan.com/blog/test-localhost-on-mobile/)).

## Points of Interest

You may find the following code snippets within this repo useful:

#### `public/manifest.json`

Setting up your PWA's manifest, which controls how it appears when installed on a user device.

#### `pages/_app.tsx`

Configuring your `PrivyProvider` component with your login methods, app ID, embedded wallet configuration, and more.

#### `pages/index.tsx`

Using Privy's `login` method and prompting users to install your PWA using the `beforeinstallprompt` event (Android/Chrome-only).

#### `pages/dashboard.tsx`

Using Privy's `user` object and various linking methods (`linkApple`, `linkGoogle`, `linkPhone`).

#### `pages/embedded-wallet.tsx`

Using Privy's embedded wallet to sign messages, send transactions (using viem!), and export the user's private key.

#### `pages/load-assets.tsx`

An example of a page you might have in your PWA to allow users to connect an external wallet, from which they can transfer assets to their embedded wallet.
