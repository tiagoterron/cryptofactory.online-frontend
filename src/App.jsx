import Navigator from './components/Navigator.tsx';
import Header from './components/Header.tsx';
import React, { useState, useEffect, useContext } from 'react';
import logo from './logo.png'
import './App.css'

import { TransactionContext } from "./context/TransactionContext";

const App = () => {
  const { isLoading } = useContext(TransactionContext);

  if(isLoading == true) {
    return <div className="div-bg-loading">
              <div><img src="https://z0sqrs02-a.akamaihd.net/loading_icons/loading-default.gif" /></div>
              <div className="s-text text-dark h5">Please, hold on a second. We are processing your request.</div>
              <div className="s-text text-dark h4 mt-2">After a metamask window pops up, you need to confirm the transaction.</div>
          </div>;
  }
  return (
<>
  <Navigator />
    <Header />

</>
  )
}

export default App
