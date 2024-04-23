import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./navbar.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function NavigationBar() {

  const navigate = useNavigate();


  const handleHomeSafety = (e) => {

    e.preventDefault();
    navigate("/homeSafety");
  };
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Container className="navbar-container">
        <Navbar.Brand className="navlink-1" href="#home">
          Home
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link className="navlink-2"  onClick={handleHomeSafety}>
            Home Safety
          </Nav.Link>
          <Nav.Link className="navlink-3" href="#features">
            Route Safety
          </Nav.Link>
          <Nav.Link className="navlink-4" href="/accountInfo">
            Account
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
