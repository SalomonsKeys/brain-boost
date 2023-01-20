import "../styles/globals.css";
import { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import React, { useState, useEffect} from "react";
import SDK from "weavedb-sdk";


export default function MyApp({ Component, pageProps, myProp }) {
  
  const [user, setUser] = useState("");
 

  function ether() {
    const {ethereum} = window;

    if (ethereum) {
        return ethereum;
    } else {  
      throw new Error("There was an error fetching metamask object");
    }
  }


  const getCurrentWalletConnected = async () => {
    const eth = ether();
    
    const accountsArray = await eth.request({ method: "eth_accounts" });

    if (accountsArray.length > 0) {
      console.log("Found an authorized account:", accountsArray[0]);
      setUser(accountsArray[0]);
    } else {
      setUser("")
      console.log("No authorized account found");
      alert("Connect your Metamask Web2 clown :P")
    }
  };

  function walletListener() {
    const ethereum = ether();

    ethereum.on("accountsChanged", function (accounts) {
        if (accounts.length > 0) {
            setUser(accounts[0]);
            console.log("Account changed to:", accounts[0]);
            
        } else{
            setUser("")
            console.log("Please connect to MetaMask.");
        }
    });

    ethereum.on('disconnect', () => {
        setUser("");
        
      });
  }


  // Use effect runs after so db doesnt get initialized until after everything else returns
  // This means we should initialize the db wherever we are going to use it
  // I will come back to this to test it out
  
  useEffect(() => {
    getCurrentWalletConnected();
    walletListener();
    console.log("Use effect ran from _app.jsx")
  
  }, []);
  
  return (
    <>
      {user !== "" && <Navbar 
        users={user}
        setUsers={setUser}
       
      />}
      
      <Component 
        {...pageProps} 
        users={user}
        setUsers={setUser}
        
      />
      <Analytics />
    </>
  );
}

