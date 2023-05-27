import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  ListGroupItem,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions';
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants';
import { useParams, useNavigate } from 'react-router-dom';

toast.configure();

const OrderScreen = ({}) => {
  const { id } = useParams();
  // console.log(useParams());

  const navigate = useNavigate();

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  // console.log(orderDetails)

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;


  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    order.itemsPrice = addDecimals(
      order.cart.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }

    if (!order || successPay || successDeliver || order.id !== id) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(id));
    } else if (order.isPaid) {
      
    }

    //console.log(order);
    if (order) {
      const findTimeLeft = () => {
        const msLeft = new Date(order.expiresAt) - new Date();
        setTimeLeft(Math.round(msLeft / 1000));
      };

      findTimeLeft();
      const timerId = setInterval(findTimeLeft, 1000);

      return () => {
        clearInterval(timerId);
      };
    }
  }, [dispatch, id, successPay, successDeliver, order]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  const handleToken = (token) => {
    console.log(token);
    dispatch(payOrder(id, token));
  };

  if (timeLeft < 0) {
    <div>Order Expired</div>;
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order.id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>

              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.cart.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.cart.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.title}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.productId}`}>
                            {item.title}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>GST</Col>
                  <Col>₹{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {(!order.isPaid && timeLeft > 0) && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  <StripeCheckout
                    image="/Project.jpg"
                    name="KarKaushal"
                    description="E-commerce Platform"
                    token={handleToken}
                    stripeKey="pk_test_JMdyKVvf8EGTB0Fl28GsN7YY"
                    amount={order.totalPrice * 100}
                    email={userInfo.email}
                    currency="INR"
                  />
                </ListGroup.Item>
              )}
              {(!order.isPaid && timeLeft > 0)&& (
                <ListGroupItem>
                  <h4>Time left to pay: {timeLeft} seconds</h4>
                </ListGroupItem>
              )}
              {(!order.isPaid && timeLeft < 0) && (
                <ListGroup.Item>
                  <h3>{order.status}</h3>
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isSeller &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
