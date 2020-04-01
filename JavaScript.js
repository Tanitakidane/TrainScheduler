var firebaseConfig = {
    apiKey: "AIzaSyA7hN72j1zwClXteddzzFFCAgq5NuK1Icw",
    authDomain: "trainscheduler-87fc6.firebaseapp.com",
    databaseURL: "https://trainscheduler-87fc6.firebaseio.com",
    projectId: "trainscheduler-87fc6",
    storageBucket: "trainscheduler-87fc6.appspot.com",
    messagingSenderId: "928864743802",
    appId: "1:928864743802:web:a2a66f85251828fce426c3",
    measurementId: "G-H1W7WXSJWN"
  };

firebase.initializeApp(config);

var database = firebase.database();

var name = "";
var destination = "";
var firstTrain = "";
var frequency = 0;
var nextTrain = "";
var timeToArrival = 0;

function findNextTrain(initialTime){

    var initialTimeConverted = moment(initialTime, "HH:mm"); 

    var now = moment();

    var timeDifference = moment().diff(moment(initialTimeConverted), "minutes");
    
    var timeRemainder = timeDifference % frequency;

    var minutesToTrain = frequency - timeRemainder;
    timeToArrival = minutesToTrain;

    nextTrain = moment().add(minutesToTrain, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm A");
}

function addTrain(e) {

    e.preventDefault();

    name = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

    findNextTrain(firstTrain);
    
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");
    
    database.ref().push({
        name: name,
        destination: destination,
        nextTrain: nextTrain,
        frequency: frequency,
        timeToArrival: timeToArrival,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
}

database.ref().on("child_added", function(snapshot){
    var sv = snapshot.val();

    $("#trains").append(
        `<tr>
            <td>${sv.name}</td>
            <td>${sv.destination}</td>
            <td>${sv.frequency}</td>
            <td>${sv.nextTrain}</td>
            <td>${sv.timeToArrival}</td>
        </tr>`
    );

}, function(errorObject) {
    console.log("Error: " + errorObject.code);
});

$("#add-train").on("click", addTrain);


