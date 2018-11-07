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

    // get todo detail
    app.get("/api/todo/:todoId", function (req, res) {
        Todo.child(req.params.todoId).once("value")
        .then(function (snapshot) {
            if (snapshot.exists()) {
                res.json(snapshot.val());
            }
            res.send(null);
        })
        .catch(function (err) {
            console.log(err);
        })
    });

    // create todo and send back all todos after creation
    app.post("/api/todos", function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.push({
            text: req.body.text,
            done: false
        })
            .then(function (result) {
                // get and return all the todos after you create another
                getTodos(res);
            })
            .catch(function (err) {
                console.log(err);
            });
    });

    // delete a todo
    app.delete("/api/todos/:todoId", function (req, res) {

        Todo.child(req.params.todoId).remove()
            .then(function (result) {
                getTodos(res);
            })
            .catch(function (err) {
                console.log(err);
            });
    });

    // edit a todo
    app.put("/api/todos", function (req, res) {

        var todoId = req.body.todoId;
        var params = {};

        params[todoId] = {
            text: req.body.text,
            done: req.body.done
        }

        Todo.update(params)
            .then(function (result) {
                getTodos(res);
            })
            .catch(function (err) {
                console.log(err);
            });
    });

    // application -------------------------------------------------------------
    app.get("*", function (req, res) {
        res.sendFile(__dirname + "/public/index.html"); // load the single view file (angular will handle the page changes on the front-end)
    });
};
