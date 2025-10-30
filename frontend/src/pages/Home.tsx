import React from "react";
import Hero from "../common/componets/Hero";
import { Row, Card, Button, Col } from "react-bootstrap"

const Home: React.FC = () => {
    return (
        <div>
            <Hero />
            <Row className="g-4 d-flex justify-content-center mb-3 mt-3">
                {[1, 2, 3].map((index) => (
                    <Col key={index} xs={12} sm={6} md={4} lg={3}>
                        <Card className="shadow-lg h-100 border-2 rounded-4 bg-light text-dark">
                            <Card.Body className="d-flex flex-column text-center p-4">
                                <Card.Title className="fw-bold fs-5 text-dark mb-2">
                                    Web Development Fundamentals
                                </Card.Title>
                                <Card.Text className="text-secondary mb-4">
                                    Duration: <span className="fw-semibold text-dark">3 Months</span>
                                </Card.Text>
                                <Button
                                    variant="outline-primary"
                                    className="mt-auto fw-semibold rounded-3"
                                >
                                    View Details
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default React.memo(Home);