import React, { Component } from 'react';
import { storage } from './firebase';
import axios from 'axios';
import { Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

/********************************************** */
toast.configure();
class Addcorsecard extends Component {
  

  constructor(props) {
    super(props);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeimage = this.onChangeimage.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.state = {
      image: null,
      url: '',
      progress: 0,
      material: '',
      description: '',
      title: '',
      price: 0,
      name:localStorage.getItem("Name"),
      courseId:'1'
    }
  }
  // this function will handele firebase
  handleUpload = () => {
    const uploadTask = storage.ref(`images/${this.state.image.name}`).put(this.state.image);
    uploadTask.on('state_changed',
      (snapshot) => {
        // progrss function ....
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.setState({
          progress: progress
        })
      },
      (error) => {
        // error function ....
        console.log(error);
      },
      () => {
        // complete function ....
        storage.ref('images')
          .child(this.state.image.name)
          .getDownloadURL()
          .then(url => {
            console.log(url);
            this.setState({ url: url });

          })
      });
  }
  
  ////////////////////////////// HANDEL STATE//////////////////////
  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    })
  }
  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    })
  }
  onChangeimage(e) {

    if (e.target.files[0]) {
      this.setState({
        image: e.target.files[0]
      })
      console.log('image', e.target.files[0])

    }

  }
  onChangePrice(e) {
    this.setState({
      price: e.target.value
    })
  }
  ////////////////////////////// HANDEL STATE//////////////////////
  onSubmit = async (e) => {
    e.preventDefault();
    const task = {
      Title: this.state.title,
      Desceription: this.state.description,
      image: this.state.url,
      Name: this.state.name,
      price: this.state.price
    }
    var userId = localStorage.getItem('id');
    console.log(task);
    const res = await axios.post('http://localhost:8000/teacher/addcard', task) //create?
    console.log(res.data);
    this.setState({ courseId : res.data._id })
    if (res.status === 200) 
    toast("Success! New course is added", { type: "success" });
  else {
      toast("Something went wrong", { type: "error" });
    } 
    const data = await axios.post("http://localhost:8000/user/addNewCourse/"+userId,{id:this.state.courseId});
    console.log(data , this.state.courseId);
    

    
  }

  render() {
    return (
      <div>
        <br />
        <div className="container">
          <form className="text-center border border-light p-9" action="#!" onSubmit={this.onSubmit} >
            <div className="col">
              <h3>Add image</h3>
              <input
                type="file"
                required="{true}"
                className="form-control"
                onChange={this.onChangeimage}
              />
            </div>
            <button onClick={this.handleUpload}>Upload</button>

            <br />
            <iframe  title="myFrame" src={this.state.url} alt="firebase-image" width='400' height='400' ></iframe>
            <p className="h4 mb-4">matireal</p>
            <br />


            <br />

            <div className="col">
              <h3>Title  </h3>

              <input
                required="{true}"
                type="text"
                className="form-control"
                value={this.state.title}
                onChange={this.onChangeTitle}
                text-align="center"
                placeholder="Insert Course Name" />
            </div>


            <br />

            <div className="col">
              <h3>Description  </h3>
              <input
                type="text"
                required="{true}"
                className="form-control"
                value={this.state.description}
                onChange={this.onChangeDescription}
                placeholder="Please insert a description of your item and add its current condition" />
            </div>
            <br />
            <div className="col">
              <h3>Price</h3>
              <input
                type="number"
                required="{true}"
                className="form-control"
                value={this.state.price}
                onChange={this.onChangePrice}
                placeholder="add price" />
            </div>

            <br />

            <div>
              <Button type="submit" value="Submit" className="btn btn-deep-orange darken-4">Submit</Button>
              <Link to={`/addNewLesson ?id=${this.state.courseId}`} style={{fontSize:'1.2rem'}}>Lets go and add a  lesson &#x261D; &#128515; </Link>

            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Addcorsecard;