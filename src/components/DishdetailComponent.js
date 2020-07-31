import React,{ Component } from 'react';
import { Card, CardImg, CardBody, CardText, CardTitle, BreadcrumbItem, Breadcrumb } from 'reactstrap';
import { Button, Modal, ModalHeader, ModalBody, Label, Row, Col } from 'reactstrap';
import { LocalForm, Control, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';


const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);

class CommentForm extends Component{

    constructor(props){
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {
            isModalOpen: false
        }
    }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values){
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);

        }  

    render(){
        return(
            <div>
                <Button outline onClick={this.toggleModal} color="secondary" size="sm"><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>{' '}
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating" className="col-12" >Rating</Label>
                                <Col md={{size:12}}>
                                    <Control.select model=".rating" className="form-control" name="rating">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={12}><Label htmlFor="author" >Your Name</Label></Col>
                                <Col md={12}>
                                    <Control.text model=".author" name="author" 
                                    className="form-control" id="author" 
                                    placeholder="Your Name"
                                    validators={{
                                        required, minLength: minLength(3), maxLength: maxLength(15)
                                    }} />
                                    <Errors 
                                        className="text-danger"
                                        model=".yourname"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }} />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={12}><Label htmlFor="comment" >Comment</Label></Col>
                                <Col md={12}>
                                    <Control.textarea rows="5" model=".comment" name="comment"
                                    className="form-control" id="comment" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={{size:10}}>
                                    <Button type="submit" color="primary">Submit</Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>

            </div>
        );
    }
}


function RenderComments({comments, postComment, dishId}) {
    const com = comments.map((item) => {
            return(
                <div key={item.id}>
                    <p>{item.comment}</p>
                    <p>{item.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(item.date)))} </p>
                </div>
            );
        });
        if(comments != null){
            return(
                <div>
                    <h4>Comments</h4>
                    {com}
                    <div className="col-12 col-md-5">
                    <CommentForm dishId={dishId} postComment={postComment} />
                    </div>
                </div>
            );
            
        }
        else{
            return(
                <div></div>
            );
        }
    }

    function RenderDish({dish}){
        if(dish != null) {
            return(
                <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                    <CardBody>
                      <CardTitle>{dish.name}</CardTitle>
                      <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            );
        }
        else{
            return(
                <div></div>
            );
        }
    }

    const DishDetail = (props) => {
        if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (props.dish != null) {
            return(
                <div class="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>{props.dish.name}</h3>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-5 m-1">
                            <RenderDish dish = {props.dish} />
                        </div>
                        <div className="col-12  col-md-5 m-1">
                        <RenderComments comments={props.comments} postComment={props.postComment} dishId={props.dish.id}
                                />                        
                        </div>
                    </div>
                </div>
            );
        }
        
        
        
    }

export default DishDetail;