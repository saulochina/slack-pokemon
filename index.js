var express = require('express')
var bodyParser = require('body-parser')
var slack = require('./slack-api.js')
var pokeapi = require('./poke-api.js')
var app = express();

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.get('/', function(request, response) {
  response.send('Hello There!')
})

app.post('/commands', function(request, response){
  var commands = request.body.text.split(" ");
  switch(commands[1]) {
    case 'use':
      pokeapi.getPokemon(commands[2], function(json){
        var ability1 = json.abilities[0].name;
        slack.sendSlackPost({"text":ability1})
      });
      break;
    default:
      slack.sendSlackPost({"text":commands.join(" ")});
  }
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
