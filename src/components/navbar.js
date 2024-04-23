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
      {/* <Container className="navbar-container"> */}
      <Container>
        <Navbar.Brand className="navlink-1" href="#home">
          Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Empty div to push the nav items to the right */}
          </Nav>
          <Nav>
            <Nav.Link className="navlink-2" href="" onClick={handleHomeSafety}>
              Home Safety
            </Nav.Link>
            <Nav.Link className="navlink-3" href="#features">
              Route Safety
            </Nav.Link>
            <Nav.Link className="navlink-4" href="#pricing">
              Account
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
