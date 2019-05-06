const UserModel = require('../../models/user');
module.exports.main = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let body;
  /* This is not recommended for production, I have added this    returned header to prevent CORS issues later on. */
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  }
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Invalid Content Type' })
    });
  }
  const { userProfile } = body;
  return UserModel.createUser({ userProfile }).then(data => {
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
      body: JSON.stringify({ message: 'Not Found' })
    });
  }).catch(err => {
    if (err.statusCode) {
      return callback(null, {
        statusCode: err.statusCode,
        headers,
        body: JSON.stringify({ message: 'Internal Server Error' })
      });
    }
    return callback(err);
  });
};