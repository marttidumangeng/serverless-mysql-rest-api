const User = require('../../models/user');

module.exports.main = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  }
  
  if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
    const options = event.queryStringParameters;

    return User.getUserProfile(options)
    .then(data => {
      if (data) {
        return callback(null, {
          statusCode: 200,
          headers,
          body: JSON.stringify({ data })
        });
      }
      return callback(null, {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Not found' })
      });
    })
    .catch(err => {
      if (err.statusCode) {
        return callback(null, err);
      }
      console.log(err, err.stack);
      return callback(err);
    }); 
  } else {
    return callback(null, {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Invalid params' })
    });
  }
};
