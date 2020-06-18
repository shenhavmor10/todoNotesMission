import React, { Component} from 'react';
import {observer} from "mobx-react";
import {Button ,Form,Header,Card} from 'semantic-ui-react'
import './App.css';
import myNotes from './GlobalNotes';
import Note from './components/Note' 
import 'semantic-ui-css/semantic.min.css'

interface Iprops{

}

interface Istate{
  noteName:string;
}

@observer
class App extends Component<Iprops,Istate> {
  constructor(props:Readonly<Iprops>){
    super(props);
    this.state = {
      noteName: ""
    }
    myNotes.getInitialData()
  }
  render(){
    return (<div className = "myHeader">
      <Header className = 'my-Colors' as = "h1"textAlign='center'>Notes & Todos</Header>
      {myNotes.notes.length===myNotes.maxNotes&&<Header as ="h2">{myNotes.popupMessage}
      </Header>}
        <Form onSubmit ={(e)=>{
          myNotes.addNote(this.state.noteName);
          this.setState({noteName:""})
        }}
        >
        <Form.Field className = 'myHeader'>
          <input className = "my-Input" value = {this.state.noteName} onChange={(e)=>{
          this.setState({noteName:e.target.value});
        }} placeholder='Enter note : '/>
        <Button secondary className = "my-Input">Submit</Button>
        </Form.Field>
        </Form>  
      
      {myNotes.notes.map((note)=>{
        return(

          <Card className = 'my-card' centered color ='red' header ='a'>
            <Note key = {note.id} id={myNotes.findNote(note.id)} >
            </Note>
          </Card>

  
        )

      })

    }
    
      </div>
    )}
}



export default App;
