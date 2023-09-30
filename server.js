const express = require("express")
// const cors = require("cors")
const sqlite3 = require('sqlite3').verbose()

const app = express()
const db = new sqlite3.Database('TaskPlanner.sqlite3')

// app.use(cors())
app.use(express.json())

const port =  process.env.PORT || 8080

//API Enpoints

// Root enpoint
app.get("/", (req, res) =>{
    res.send("Welcome! You have reached the root endpoint.")
})


// API Endpoint to add a task
app.post("/api/v1/task", (req, res) =>{
    const {title, description} = req.body
    const status = 'OPEN'

    db.run('INSERT INTO tasks (task_title, task_desc, task_status) VALUES (?, ?, ?)', 
        [title, description, status], function(err) {
        if (err) {
          console.log("Error: " + err.message)
          return res.status(500).json(
                { 
                    error: "Something went wrong",
                    payload_example: {
                        title: "Test Task", 
                        description: "Test Description" 
                    } 
                }
            )
        }
        
        res.status(201).json({ 
            task_id: this.lastID, 
            status: 'OPEN', 
            message: 'Task created successfully'
        })
      })
})


// API Endpoint to get tasks (Paginated)
app.get("/api/v1/task", (req, res) =>{
    const page = req.query.page || 1
    const limit = 5;
    const offset = (page - 1) * limit

    db.all('SELECT * FROM tasks ORDER BY task_id DESC LIMIT ? OFFSET ?', [limit, offset], (err, rows) => {
        if (err) {
        console.log(err.message)
        return res.status(500).json(
            { 
                error: "Something went wrong"
            }
        )
        }
        res.json(rows)
    })
})


// API Endpoint to update a task
app.patch("/api/v1/task/:id", (req, res) =>{
    const task_id = req.params.id
    const { title, description, status } = req.body

    // Update Query Buider 
    let update_query = 'UPDATE tasks SET '
    const query_prams = []

    if (title) {
        update_query += 'task_title = ?, '
        query_prams.push(title)
    }

    if (description) {
        update_query += 'task_desc = ?, '
        query_prams.push(description)
    }

    if (status) {
        // Validate status
        const valid_statuses = ['OPEN', 'INPROGRESS', 'CLOSED']
        
        if (!valid_statuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Status must be OPEN, INPROGRESS, or CLOSED.' })
        }

        update_query += 'task_status = ?, '
        query_prams.push(status)
    }

    update_query += 'last_updated = CURRENT_TIMESTAMP '

    update_query += 'WHERE task_id = ?'
    query_prams.push(task_id)


    db.run(update_query, query_prams, function(err) {
        if (err) {
            console.log("Error: " + err.message)
            return res.status(500).json(
                  { 
                      error: "Something went wrong",
                      payload_example: {
                          title: "Test Task", 
                          description: "Test Description",
                          staus: "OPEN | INPROGRESS | CLOSED"
                      } 
                  }
              )
        }
    
    res.json({ 
        task_id: task_id, 
        status: status,
        message: 'Task updated successfully' })
  })
  
})


// API Endpoint to get task metrics
app.get("/api/v1/task_metrics", (req, res) =>{
    const page = req.query.page || 1
    db.get(`SELECT COUNT(*) AS total_tasks, 
    SUM(CASE WHEN task_status = "OPEN" THEN 1 ELSE 0 END) AS open_tasks, 
    SUM(CASE WHEN task_status = "INPROGRESS" THEN 1 ELSE 0 END) AS inprogress_tasks,
    SUM(CASE WHEN task_status = "CLOSED" THEN 1 ELSE 0 END) AS completed_tasks  
    FROM tasks`, (err, row) => {
        if (err) {
        console.log(err.message)
        return res.status(500).json(
            { 
                error: "Something went wrong" 
            }
        )}
        
        res.json(row)
    })
})
  

//Run server
app.listen(port, () =>{
    console.log("Started server on port " + port)

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS tasks(
        'task_id INTEGER PRIMARY KEY AUTOINCREMENT, 
        'task_title TEXT NOT NULL, task_desc TEXT, task_status TEXT, 
        'created_on DATETIME DEFAULT CURRENT_TIMESTAMP, 
        'last_updated DATETIME DEFAULT CURRENT_TIMESTAMP)`)
    })

    console.log("Database initialized")
})