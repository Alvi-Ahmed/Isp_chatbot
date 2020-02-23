const dialogflow = require('dialogflow');
const uuid = require('uuid');
const express = require('express');
const bodyParser = require('body-parser')
const app =express()
const port = 5000;

const sessionId = uuid.v4();

app.use(bodyParser.urlencoded({
    extended:false
}))

app.use(function (req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true); 

    next();
}

);
app.get('/', function(request, response){
response.render('isp-bot/index');
});
app.post('/send-msg',(req,res)=>{
    runSample(req.body.MSG).then(data=>{
        res.send({Reply:data})
    })
})
/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(msg,projectId = 'isp-bot-joksap') {
  // A unique identifier for the given session
  

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
      keyFilename:"/Users/alviahmed/Downloads/Isp_bot/ISP-bot-0d91bde012a3.json"
  });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: msg,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  return result.fulfillmentText; 
}

app.listen(port,()=>{
    console.log("running on port "+port)
}
)
