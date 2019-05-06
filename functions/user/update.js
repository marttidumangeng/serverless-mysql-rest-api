const UserModel = require('../../models/user');

module.exports.main = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  }
  const { userId, updateData } = event;

  return UserModel.updateUser({ updateData, userId })
    .then((data) => {
      if (data) {
        return callback(null, {
          statusCode: 200,
          headers, 
          body: JSON.stringify({ message: 'success' })
        });
      } else {
        return callback(null, {
          statusCode: 404,
          headers, 
          body: JSON.stringify({ message: 'user not found' })
        });
      }
    })
    .catch(err => {
      if (err.statusCode) {
        return callback(null, err);
      }
      return callback(err);
    });
};
