var app = require('express')();
//var utility = require("./utility/utility");
//var updateTable = require("./model/update-location");
//var routeAssignTable = require("./model/route_assign_list");
var port = 5005;
var trim = require('trim');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(app.router);

var http = require('http').Server(app);

console.log("test");

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
process.on('uncaughtException', function (err) {
    console.log("caught exception : ");
    console.log(err);
});
process.setMaxListeners(0);
http.listen(port, function () {
    console.log('Process ' + process.pid + ' is listening to all incoming requests', port);

});
app.get('/', function (req, res) {

    res.send('this the server page').end();

});

const { MongoClient } = require('mongodb');
const { parse } = require('path');
const uri = "mongodb+srv://developer_insane:SampleProject1987@cluster0.xelgh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



app.get('/orders/create/', function (req, res) {
    console.log("params create", req.params.id);
    res.send('listnening to create' + req.params.id).end();
    client.connect(err => {
        if (err) throw err;
      var db_ecom = client.db("test_ecom");

      var dataToInsert = {
        "order_id": "123",
        "item_name":"Samsung Mobile",
        "cost":"400",
        "order_date":"2020/12/01",
        "delivery_date":"2020/12/11"
        }
        db_ecom.collection("orders").insertOne(dataToInsert, function(err, res) {
          if (err) throw err;
          res.send("1 document inserted").end();
          client.close();
        });
      });

});
app.get('/orders/update/:id', function (req, res) {
    console.log("params update", req.params);
    res.send('listnening to update' + JSON.stringify(req.params)).end();
    var orderId = parseInt(req.params.id);
    client.connect(err => {
        if (err) throw err;
    var dbo = client.db("test_ecom");
    var myquery = { order_id: orderId};
    var newvalues = { $set: {"item_name":"Samsung Mobile","cost":"400",} };
    dbo.collection("orders").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      client.close();
    });
    
      });


});
app.get('/orders/list/:id', function (req, res) {
    console.log(" params list", req.params);
    res.send('listnening to list' + req.params).end();

    var orderId = parseInt(req.params.id);
    client.connect(err => {
        if (err) throw err;
    var dbo = client.db("test_ecom");
      dbo.collection("orders").findOne({}, function(err, result) {
        if (err) throw err;
        console.log("from mongo",result);
        client.close();
      });
    
      });

});
app.get('/orders/search/:id', function (req, res) {
    console.log(" params search", req.params.id);
    res.send('listnening to search' + req.params.id).end();

    var searchId = parseInt(req.params.id);
    client.connect(err => {
        if (err) throw err;
    var dbo = client.db("test_ecom");

    var query = { order_id: searchId };
    dbo.collection("orders").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      client.close();
    });
    
    
      });

});
app.get('/orders/delete/:id', function (req, res) {
    console.log(" params delete", req.params.id);
    res.send('listnening to delete' + req.params.id).end();
    var deleteId = parseInt(req.params.id);
    client.connect(err => {
        if (err) throw err;
    var dbo = client.db("test_ecom");
    var myquery = { order_id: deleteId};
    dbo.collection("customers").deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      client.close();
    });
    
      });

});
