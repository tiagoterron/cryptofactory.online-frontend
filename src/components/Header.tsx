import React, { useContext } from "react";
import Banner from './Banner.tsx';
import Box1 from './Box1.tsx';
import { Card, Container, Row, Col, NavDropdown, Button } from 'react-bootstrap';

import { TransactionContext } from "../context/TransactionContext";




const Header = () => (
<>
<Container className="container-new">

  <Row className=" my-5">
    <Box1 />
  </Row>
</Container>
</>
);

export default Header;
