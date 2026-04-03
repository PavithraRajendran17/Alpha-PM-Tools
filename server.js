const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Task = require('./models/Task');

const app = express();

// Database Connection
mongoose.connect('mongodb+srv://pavithrapanimalar30_db_user:Pavima%401705@cluster0.sbnz67e.mongodb.net/?appName=Cluster0')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.log('❌ DB Error:', err));

app.set('view engine', 'ejs');

// Path setup-ah innum safe-ah mathi irukken
app.set('views', path.resolve(__dirname, '..', 'frontend', 'views'));
app.use(express.static(path.resolve(__dirname, '..', 'frontend', 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({}).sort({ createdAt: -1 });
        const completedCount = tasks.filter(t => t.isCompleted).length;
        const percentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
        res.render('index', { tasks, percentage });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

app.post('/add', async (req, res) => {
    await Task.create({ 
        projectName: req.body.projectName, 
        taskDescription: req.body.taskDescription 
    });
    res.redirect('/');
});

app.post('/toggle/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if(task) {
        task.isCompleted = !task.isCompleted;
        await task.save();
    }
    res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(3000, () => console.log('🚀 Server: http://localhost:3000'));