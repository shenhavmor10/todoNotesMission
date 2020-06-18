from fastapi import FastAPI
from typing import List
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pyodbc
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "*"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Note(BaseModel):
    id: int
    todos : list
    noteName:str
    dateCreated:str
    lastUpdated:str



cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER=DESKTOP-L628613\\SQLEXPRESS;DATABASE=todoServer;UID=sa;PWD=1234;')
cursor = cnxn.cursor()
@app.get("/notes")
def showDataBase():
    print("Start of connection")
    print("ss")
    jsonFinished=[]
    jsonFile={}
    todosList=[]
    notesList=[]
    tempList=[]
    cursor.execute('SELECT id FROM todoServer.dbo.Notes')
    for tempNotes in cursor:
        notesList.append(tempNotes)
    for rows in notesList:
        cursor.execute('SELECT COUNT(*) FROM todoServer.dbo.NotesAndTodos WHERE noteID = ' + str(rows.id))
        result=cursor.fetchone()
        if (result):
            cursor.execute('SELECT todoID FROM todoServer.dbo.NotesAndTodos WHERE noteID = '+str(rows.id))
            for todos in cursor:
                tempList.append(todos)
            for todos in tempList:
                todo={}
                cursor.execute('SELECT * FROM todoServer.dbo.Todos WHERE todoID = ? ORDER BY todoID',str(todos.todoID))
                for i,x in enumerate(cursor):
                    todo={"todoId":str(i),"title":x.title,"completed":x.completed}
                todosList.append(todo)
                tempList=[]
        cursor.execute('SELECT * FROM todoServer.dbo.Notes WHERE id = '+str(rows.id))
        for x in cursor:
            jsonFile={"todos" : todosList,"_id":"sdasd","id":str(x.id),"noteName":x.noteName,"dateCreated":x.dateCreated,"lastUpdated":x.lastUpdated}
            todosList=[]
        jsonFinished.append(jsonFile)


    ToServer=json.dumps(jsonFinished)
    return JSONResponse(content=ToServer)

@app.post("/notes")
async def insertNotesIntoDatabase(note:Note):
    cursor.execute("INSERT INTO todoServer.dbo.Notes (id, noteName, dateCreated, lastUpdated) VALUES (?,?,?,?)",note.id,note.noteName,note.dateCreated,note.lastUpdated)
    cnxn.commit()
    print(note.id)

@app.get("/notes/{item_id}")
async def DeleteNoteFromDataBase(item_id: int):
    cursor.execute("SELECT todoID FROM todoServer.dbo.NotesAndTodos WHERE noteID =?",item_id)
    todoIDs=cursor.fetchall()
    cursor.execute("DELETE FROM todoServer.dbo.NotesAndTodos WHERE noteID=?", item_id)
    cnxn.commit()
    for x in todoIDs:
        cursor.execute("DELETE FROM todoServer.dbo.Todos WHERE todoID=?", x.todoID)
        cnxn.commit()
    cursor.execute("DELETE FROM todoServer.dbo.Notes WHERE id=?",item_id)
    cnxn.commit()
    print(id)
    print("entered")

@app.post("/notes/update")
async def updateNoteInDataBase(note: Note):
    print("here")
    todos = note.todos
    cursor.execute('SELECT count(todoID) FROM todoServer.dbo.NotesAndTodos WHERE noteID = ?', note.id)
    count=cursor.fetchone()[0]
    if(count< len(todos)):
        cursor.execute('SELECT count(todoID) FROM todoServer.dbo.Todos')
        todoAmount=cursor.fetchone()[0]
        if(todoAmount==0):
            cursor.execute("INSERT INTO todoServer.dbo.Todos (todoID,title,completed) VALUES (0,?,?)",todos[-1]["title"], todos[-1]["completed"])
            cnxn.commit()
            cursor.execute("INSERT INTO todoServer.dbo.NotesAndTodos (noteID,todoID) VALUES (?,0)", note.id)
            cnxn.commit()
        else:
            cursor.execute("SELECT todoID FROM todoServer.dbo.Todos Where todoID = (SELECT max(todoID) FROM todoServer.dbo.Todos)")
            max_id = cursor.fetchone()[0]
            cursor.execute("INSERT INTO todoServer.dbo.Todos (todoID,title,completed) VALUES (?,?,?)", max_id+1,todos[-1]["title"], todos[-1]["completed"])
            cnxn.commit()
            cursor.execute("INSERT INTO todoServer.dbo.NotesAndTodos (noteID,todoID) VALUES (?,?)", note.id,max_id+1)
            cnxn.commit()

    else:
        for i,x in enumerate(todos):
            print(i)
            cursor.execute('SELECT todoID FROM todoServer.dbo.NotesAndTodos WHERE noteID = ?',note.id)
            loadTodos=cursor.fetchall()
            print("todoID")
            print(loadTodos[i][0])
            cursor.execute('SELECT completed FROM todoServer.dbo.Todos WHERE todoID = ?',loadTodos[i][0])
            completedOld=cursor.fetchone()[0]
            newCompleted=x["completed"]
            if(completedOld!=newCompleted):
                cursor.execute("UPDATE todoServer.dbo.Todos SET completed = ? WHERE todoID=?",newCompleted,loadTodos[i][0])














