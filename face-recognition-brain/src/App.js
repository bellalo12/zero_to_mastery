import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import Clarifai from 'clarifai';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import './App.css';


const app = new Clarifai.App({
 apiKey:'f9d8f19378684c46bf17d029cabed99f'
});

const particlesOptions ={
  particles: {
  number: {
    value: 327,
    density: {
      enable: true,
      value_area: 868
    }
  }
  }
}

class App extends React.Component{
  constructor(){
    super();
    this.state={
      input: '',
      imageUrl: '',
      box:{}
    }
  }

  calculateFaceSize=(data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      topRow: clarifaiFace.top_row * height,
      leftCol: clarifaiFace.left_col * width,
      bottomRow: height - (clarifaiFace.bottom_row * height),
      rightCol:  width - (clarifaiFace.right_col * width)
    }
  }

  displayFaceBox=(box)=>{
    this.setState({box: box})
  }

  onInputChange=(event)=>{
    this.setState({input: event.target.value})
  }

  onButtonSubmit=()=>{
    this.setState({imageUrl: this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response=> this.displayFaceBox(this.calculateFaceSize(response)))
      .catch(err=>console.log(err))
    }

  render(){
    return(
      <div className='App'>
      <Particles className='particles'
      params={particlesOptions}
            />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm
      onInputChange={this.onInputChange}
      onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;