import React, { useContext } from "react";
import { useState, useEffect } from 'react';
import { Card, Container, Row, Col, NavDropdown, Button } from 'react-bootstrap';
import { ethers, utils, BigNumber } from 'ethers';
import { TransactionContext } from "../context/TransactionContext";

const Banner = () => {
const { transactionCount, BUSD, BUSDMK, DepositBUSD, USER } = useContext(TransactionContext);

return(

<Col xs={12} md={12}>
      <div className="d-grid div_1 m-3 bg-dark text-white p-3 border-radious">
        <h2>Mint BUSDMK</h2>
        
        <Row className="mx-1">
          <Col md={4} className="d-grid my-3 ml-1"><h3>Token Price</h3><p>{BUSDMK.TokenPrice}</p></Col>
          <Col md={4} className="d-grid my-3 ml"><h3>Number of Investors</h3><p>{BUSDMK.TotalUsers}</p></Col>
          <Col md={4} className="d-grid my-3 ml-1"><h3>Token Price</h3><p>1.5000.00</p></Col>
          
          <Col md={4} className="d-grid my-3 ml-1"><h3>Circulating Supply</h3><p>{BUSDMK.TotalSupply}</p></Col>
          <Col md={4} className="d-grid my-3 ml-1"><h3>Available Supply</h3><p>{BUSDMK.AvailableSupply}</p></Col>
          <Col md={4} className="d-grid my-3 ml-1"><h3>Number of Investors</h3><p>1.5000.00</p></Col>

<div className="col-xl-3 col-lg-6 mb-4">
    <div className="">
      <div className="progress mx-auto" data-value='50'>
        <span className="progress-left">
            <span className="progress-bar border-primary"></span>
        </span>
        <span className="progress-right">
          <span className="progress-bar border-primary"></span>
        </span>
        <div className="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
          <div className="h2 font-weight-bold">10%</div>
        </div>
      </div>
    </div>
  </div>
        </Row>
      </div>
    </Col>


)

};

export default Banner;
