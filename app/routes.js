var Todo = require("./models/todo");
var Response = require("./config/constants");

function getTodos(res) {
    console.log("error here");
    Todo.once("value")
        .then(function (snapshot) {
            if (snapshot.exists()) {
                res.json(snapshot.val()); // return all todos in JSON format
            }

            // if there is an error retrieving, send the error. nothing after res.send([message]) will execute
            res.send(null);
        })
        .catch(function (err) {
            console.log(err);
        })
}

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get("/api/todos", function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    // create todo and send back all todos after creation
    app.post("/api/todos", function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.push({
            text: req.body.text,
            done: false
        })
            .then(function (err) {
               
                console.log(err);

                // get and return all the todos after you create another
                getTodos(res);
            })
            .catch(function (err) {
                console.log(err);
            });
    });

    // delete a todo
    app.delete("/api/todos/:todo_id", function (req, res) {

        Todo.child(req.params.todo_id).remove()
            .then(function (err) {
                if (err)
                    res.send(err);

                getTodos(res);
            })
            .catch(function (err) {
                console.log(err);
            });;
    });

    // application -------------------------------------------------------------
    app.get("*", function (req, res) {
        res.sendFile(__dirname + "/public/index.html"); // load the single view file (angular will handle the page changes on the front-end)
    });
};
