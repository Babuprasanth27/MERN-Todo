//Express
const express = require('express')
const mongoose = require('mongoose')//it is used to connect mongoDB
const cors = require('cors');


//Creating an instance of express

const app = express();
//Using the middleware 
app.use(express.json())
app.use(cors())


// //Define a route
// app.get('/',(req,res) => {
//     res.send("Hello !!")
// })

//Sample in-memory Storage for todo items
// let todos = [];

//Connecting to MongoDB

mongoose.connect('mongodb://localhost:27017/todo-list')
.then(() => {
    console.log("DB Connected");
})
.catch((err) =>{
    console.log(err);
})


//Creating the Schema

const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})



//Creating Model
const todoModel = mongoose.model('Todo', todoSchema);

//Create a new todo item
app.post('/todos', async (req,res) =>{
    const {title, description} = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo); //It is an array where title and description are stored in the array.
    // console.log(todos);  
    try{
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch(error){
        console.log(error);
        res.status(500).json({message : error.message});
    }
})

//Get All items

app.get('/todos', async (req,res) => {
    try{
        const todos = await todoModel.find();
        res.json(todos);
    }catch(error){
        console.log(error);
        res.status(500).json({message : error.message});
    }  
})

//Update todo Items

app.put('/todos/:id', async(req,res) =>{
    try {
        const {title, description} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title, description},
            {new : true}
        )
        if(!updatedTodo){
            return res.status(404).json({message: "Todo not found"})
        }
        res.json(updatedTodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message});
    }
})


//Delete the Items

app.delete('/todos/:id', async (req,res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error.message});
    }
})

//Start the server
const port = 8000;
app.listen(port, ()=>{
    console.log("Server is running on ",port);
})