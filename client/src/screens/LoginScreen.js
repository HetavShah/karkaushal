import React, { useState, useEffect } from "react";
import { Link, redirect } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";

const LoginScreen = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { search } = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = search ? search.split("=")[1] : "/";
  console.log(redirect);
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect]);

  const submitHandler = async(e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button className="my-3" type="submit" variant="primary">
          Sign In
        </Button>
      </Form>

      <Row className="py-2">
        <Col>
          New Customer?
          <Link to={"/register"}>Register</Link>
        </Col>
      </Row>
      <Row className="py-2">
        <Col>
          New Seller?
          <Link to={"/seller"}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
