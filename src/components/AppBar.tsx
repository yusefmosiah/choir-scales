import { FC } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useAutoConnect } from "../contexts/AutoConnectProvider";
import NetworkSwitcher from "./NetworkSwitcher";
import NavElement from "./nav-element";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const AppBar: React.FC = () => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <div className="flex flex-row h-20 bg-gray-900 border-b border-gray-800 shadow-lg navbar md:mb-2 text-neutral-content">
      <div className="navbar-start align-items-center">
        <div className="hidden ml-10 sm:inline w-22 h-22 md:p-2">
          <Link
            href="/"
            className="font-mono text-2xl font-bold text-cyan-500 hover:text-cyan-400"
          >
            CHOIR
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
        <WalletMultiButtonDynamic className="mr-6 text-lg text-cyan-500 bg-gray-800 btn-ghost btn-sm rounded-btn hover:bg-gray-700" />
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="text-cyan-500 btn btn-square btn-ghost"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="p-2 w-52 bg-gray-800 shadow menu dropdown-content rounded-box"
          >
            <li>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <a>Autoconnect</a>
                  <input
                    type="checkbox"
                    checked={autoConnect}
                    onChange={(e) => setAutoConnect(e.target.checked)}
                    className="toggle toggle-sm toggle-cyan"
                  />
                </label>
              </div>
            </li>
            <li>
              <NetworkSwitcher />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
