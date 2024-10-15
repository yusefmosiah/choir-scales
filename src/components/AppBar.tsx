import { FC } from 'react';
import Link from "next/link";
import dynamic from 'next/dynamic';
import React, { useState } from "react";
import { useAutoConnect } from '../contexts/AutoConnectProvider';
import NetworkSwitcher from './NetworkSwitcher';
import NavElement from './nav-element';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const AppBar: React.FC = () => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <div>
      {/* NavBar / Header */}
      <div className="flex flex-row h-20 bg-black border-b shadow-lg navbar md:mb-2 text-neutral-content border-zinc-600 bg-opacity-66">
        <div className="navbar-start align-items-center">
          <div className="hidden ml-10 sm:inline w-22 h-22 md:p-2">
            <Link href="https://solana.com" target="_blank" rel="noopener noreferrer" passHref className="text-secondary hover:text-white">
              {/* Solana SVG logo */}
            </Link>
          </div>
        </div>

        {/* Nav Links */}
        <div className="navbar-center">
          <div className="hidden gap-6 md:inline-flex align-items-center justify-items">
            <NavElement
              label="Home"
              href="/"
              navigationStarts={() => setIsNavOpen(false)}
            />
            <NavElement
              label="Basics"
              href="/basics"
              navigationStarts={() => setIsNavOpen(false)}
            />
          </div>
        </div>

        {/* Wallet & Settings */}
        <div className="navbar-end">
          <WalletMultiButtonDynamic className="btn-ghost btn-sm rounded-btn text-lg mr-6" />
          <div>
            <span className="absolute block h-0.5 w-12 bg-zinc-600 rotate-90 right-14"></span>
          </div>
          <div className="dropdown dropdown-end">
            {/* Settings dropdown content */}
          </div>
        </div>
      </div>
    </div>
  );
};
