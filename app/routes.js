var Todo = require("./models/todo");
var Response = require("./config/constants");
var moment = require("moment");

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

function isDateValid(day) {
    var date = moment(day);
    return date.isValid();
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

        var request = req.body;

        var params = {
            text: request.text,
            date: request.date,
            cost: request.cost || 0,
            phone: request.phone || '',
            done: false
        };

        if (!isDateValid(params.date)) {
            res.json({
                message: "Date is not valid"
            })
        }

        if (isNaN(params.cost)) {
            res.json({
                message: "Cost is not valid"
            })
        }

        params.date = moment(params.date).format('YYYY-MM-DD');

        // create a todo, information comes from AJAX request from Angular
        Todo.push(params)
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

        var request = req.body;
        var todoId = request.todoId;
        var params = {};

        if (!todoId) {
            res.json({
                message: "Todo Id is not valid"
            })
        }

        if (!isDateValid(request.date)) {
            res.json({
                message: "Date is not valid"
            })
        }

        if (isNaN(request.cost)) {
            res.json({
                message: "Cost is not valid"
            })
        }

        params[todoId] = {
            text: request.text,
            date: moment(request.date).format("YYYY-MM-DD"),
            cost: request.cost || 0,
            phone: request.phone || '',
            done: request.done
        }

        console.log(params);

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
