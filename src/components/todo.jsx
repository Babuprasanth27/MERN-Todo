import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Box, Typography, TextField, Button, List, ListItem, Snackbar, Alert, IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Cancel as CancelIcon, Save as SaveIcon } from "@mui/icons-material";

// Custom theme with Google color combinations
const theme = createTheme({
  palette: {
    primary: {
      main: '#4285F4', // Google's blue
    },
    secondary: {
      main: '#DB4437', // Google's red
    },
    success: {
      main: '#0F9D58', // Google's green
    },
    info: {
      main: '#F4B400', // Google's yellow
    },
  },
});

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000";
    
    const handleSubmit = async () => {
        setError("");
        if (title.trim() !== '' && description.trim() !== '') {
            try {
                const res = await fetch(apiUrl + "/todos", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description })
                });

                if (res.ok) {
                    const newTodo = await res.json();
                    setTodos([...todos, newTodo]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully");
                } else {
                    setError("Unable to create Todo item");
                }
            } catch {
                setError("Unable to create Todo item");
            }
        }
    };

    useEffect(() => {
        const getItems = async () => {
            const res = await fetch(apiUrl + "/todos");
            const data = await res.json();
            setTodos(data);
        };
        getItems();
    }, []);

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = async () => {
        setError("");
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            try {
                const res = await fetch(apiUrl + "/todos/" + editId, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: editTitle, description: editDescription })
                });

                if (res.ok) {
                    setTodos(todos.map((item) => item._id === editId ? { ...item, title: editTitle, description: editDescription } : item));
                    setEditId(-1);
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Item updated successfully");
                } else {
                    setError("Unable to update Todo item");
                }
            } catch {
                setError("Unable to update Todo item");
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure want to delete?')) {
            await fetch(apiUrl + '/todos/' + id, { method: "DELETE" });
            setTodos(todos.filter((item) => item._id !== id));
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <Box className="row p-3" sx={{ bgcolor: 'primary.main', color: 'white', textAlign: 'center', mb: 2 }}>
                    <Typography variant="h4">ToDo Project with MERN stack</Typography>
                </Box>
                <Box>
                    <Typography variant="h5">Add Item</Typography>
                    {message && <Snackbar open autoHideDuration={3000} onClose={() => setMessage("")}>
                        <Alert severity="success">{message}</Alert>
                    </Snackbar>}
                    <Box display="flex" gap={2} my={2}>
                        <TextField
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                        />
                        <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
                    </Box>
                    {error && <Alert severity="error">{error}</Alert>}
                </Box>
                <Box mt={3}>
                    <Typography variant="h5">Tasks</Typography>
                    <List>
                        {todos.map((item) => (
                            <ListItem key={item._id} sx={{ bgcolor: 'info.main', mb: 2 }}>
                                <Box flex={1}>
                                    {editId === item._id ? (
                                        <Box display="flex" gap={2}>
                                            <TextField
                                                placeholder="Title"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                fullWidth
                                            />
                                            <TextField
                                                placeholder="Description"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                fullWidth
                                            />
                                        </Box>
                                    ) : (
                                        <>
                                            <Typography variant="h6">{item.title}</Typography>
                                            <Typography>{item.description}</Typography>
                                        </>
                                    )}
                                </Box>
                                <Box display="flex" gap={1}>
                                    {editId === item._id ? (
                                        <>
                                            <IconButton color="primary" onClick={handleUpdate}><SaveIcon /></IconButton>
                                            <IconButton color="secondary" onClick={() => setEditId(-1)}><CancelIcon /></IconButton>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton color="secondary" onClick={() => handleEdit(item)}><EditIcon /></IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(item._id)}><DeleteIcon /></IconButton>
                                        </>
                                    )}
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
