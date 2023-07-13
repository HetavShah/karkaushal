import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
          <div>
          Copyright &copy; KarKaushal
          </div>
          <a href="https://www.github.com/HetavShah/karkaushal"><img src="github-mark.png" height={25} width={25}></img></a>
          </Col>
          {/* <Col className="text-left py-3"><a href="https://www.github.com/HetavShah/karkaushal">Github</a></Col> */}
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
