const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    taskDescription: String,
    isCompleted: { type: Boolean, default: false }, // Task status track panna
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);