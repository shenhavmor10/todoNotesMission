import React, { Component} from 'react';
import myNotes from '../GlobalNotes';
import {Header,Form,Button,Checkbox} from 'semantic-ui-react'

interface Iprops{
   id:number;
}
interface Istate{
    todoName:string;
    checked:boolean;
}


class Note extends Component<Iprops,Istate> {
   constructor(props:Readonly<Iprops>){
       super(props);
       this.state={
        todoName:"",
        checked:false
       }
   }
   render() {
    return(
    <>
    <Header className = "headerNote" as = "h3">
    {myNotes.notes[this.props.id].noteName}
        
        <Button onClick={(e)=>{
            myNotes.deleteNote(myNotes.notes[this.props.id].id,myNotes.notes[this.props.id]._id);
        }} className = 'my-space' basic color='red' content='X' />
    </Header>
    <Form onSubmit ={(e)=>{
        myNotes.addTodo(this.props.id,this.state.todoName);
        this.setState({todoName:""})
      }}
      >
        <Form.Field>
            
            <input className = 'my-InputTodo' value = {this.state.todoName} onChange={(e)=>{
            this.setState({todoName:e.target.value}) 
            }} placeholder='Enter todo : '/>
            <Button className = "ui primary button">Submit</Button>
        </Form.Field>
    </Form> 
    <Form>
        {myNotes.notes[this.props.id].todos.map((todo)=>{
            return(
                    <div className = "my-grid" key = {todo.todoId}>
                    <Checkbox checked = {todo.completed} onChange={(e)=>{
                        myNotes.markComplete(this.props.id,todo.todoId);
                        this.setState({checked:true})
                    }}
                    ></Checkbox>
                     {todo.title}
                    </div>
                    
                )
        })
      }
      </Form>
      </>)
   }
      
}

export default Note;
