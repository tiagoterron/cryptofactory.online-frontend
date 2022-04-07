import React, { useContext } from "react";
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { TransactionContext } from "../context/TransactionContext";
import $ from 'jquery';

const Navigator = () => {

const { BUSDMK_ADDRESS, USER, connectWallet } = useContext(TransactionContext);

let userAdddress = USER.userAddress;
let userAddressShorter = userAdddress.slice(0, 6)+"..."+userAdddress.slice(38);

return(
<Navbar collapseOnSelect expand="lg" variant="dark" className="bGGIYh fixed-top">
  <Container>
  <Navbar.Brand href="#home">
  <i className="fas fa-cog  color-icons mx-2"></i>{' '}
      Crypto Factory
      </Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="me-auto mx-5">
      <Nav.Link href={"https://bscscan.com/address/"+BUSDMK_ADDRESS} target="_blank">Contract</Nav.Link>
      <Nav.Link href="https://t.me/+H71FBYkpVKE2NDli" target="_blank">Telegram</Nav.Link>
      <Nav.Link href={void(0)} id="whitepapper">Whitepaper</Nav.Link>
    </Nav>
    <Nav>
      <Nav.Link href={"https://bscscan.com/address/"+USER.userAddress} target="_blank">
        
      <div className="title-text--right">
      {
      USER.userAddress ?  
      <div className="d-flex flex-row bd-highligh">
      <div className="p-2 bd-highligh"><span className="box_color" >{userAddressShorter}</span></div>
       </div>
      : 
       <button type="submit" className="gkTzQI dZAyIf fIqiLm btn-hover" onClick={() => connectWallet()}>Connect Wallet</button>
       
       }
      </div>
      </Nav.Link>

    </Nav>
  </Navbar.Collapse>
  </Container>
</Navbar>
)
}

export default Navigator;
