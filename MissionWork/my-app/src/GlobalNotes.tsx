import {observable,IObservableArray} from 'mobx';
import axios from 'axios';

export class ITodo{
    todoId:number=0;
    title:string='';
    completed:boolean=false;
  }

export class INotes{
    _id?:string;
    id:number=0;
    noteName:string='';
    todos:ITodo[]=[];
    dateCreated:Date=new Date();
    lastUpdated:Date=new Date();
  }

class GlobalNotes {
    
    @observable notes:IObservableArray<INotes>=observable([]);
    @observable maxNotes:number=10;
    @observable currentNotesCount=0;
    @observable popupMessage:string='You have the max amount of notes !! if you want to add more notes \n please remove some in order to make new ones.';
    public async getInitialData()
    {
      const homePage=await axios.get('http://localhost:3010/notes');
      myNotes.notes=homePage.data;
    }
    public async deleteNoteToServer(_id?:string){
      await axios.delete('http://localhost:3010/notes/'+_id);
    }
    public async addNoteToServer(note:INotes){
      await axios.post('http://localhost:3010/notes',note);
      this.getInitialData();
    }
    public async updateNoteToServer(note:INotes){
      await axios.patch('http://localhost:3010/notes/'+note._id,note);
    }
    public addNote(noteName:string){
        if(this.currentNotesCount<this.maxNotes)
        {
          const newNote = new INotes();
          if(myNotes.notes.length===0)
          {
            newNote.id=0;
          }
          else
          {
            newNote.id=myNotes.notes[myNotes.notes.length-1].id+1;
          }
          console.log(newNote.id);
          newNote.noteName=noteName;
          this.notes.push(newNote);
          this.currentNotesCount=this.currentNotesCount+1;
          console.log("before");
          this.addNoteToServer(newNote);
          console.log("after");
        }


      }
    public findNote(id:number)
    {
      return this.notes.findIndex(note=>note.id===id);
      
    }
    public addTodo(id:number,todoName:string){
        const newTodo = new ITodo();
        newTodo.todoId=myNotes.notes[id].todos.length;
        newTodo.title=todoName;
        this.notes[id].todos.push(newTodo);
        this.updateNoteToServer(myNotes.notes[id]);
        
    }
    public markComplete(idNote:number,idTodo:number){
        myNotes.notes[idNote].todos[idTodo].completed=!myNotes.notes[idNote].todos[idTodo].completed;
        this.updateNoteToServer(myNotes.notes[idNote]);

    }
    public deleteNote(id:number,_id:string){
      this.notes.replace([...this.notes.filter(note=>note.id!==id)]);
      this.currentNotesCount=this.currentNotesCount-1;
      this.deleteNoteToServer(_id);
    }
      
}
const myNotes=new GlobalNotes();
export default myNotes;