import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product.id}`}>
        <Card.Img src={product.images[0]} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product.id}`}>
          <Card.Title as="div">
            <strong>{product.title}</strong>
          </Card.Title>
        </Link>
      </Card.Body>

      <Card.Text as="div">
        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
      </Card.Text>

      <Card.Text as="h3">₹{product.price}</Card.Text>
    </Card>
  );
};

export default Product;
