require('mysql2');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _ = require('lodash');
const uuid4 = require('uuid4');
const config = require('config');
var DataTypes = require('sequelize/lib/data-types');

const sequelize = new Sequelize(
    config.DB_NAME,
    config.DB_USERNAME,
    config.DB_PASSWORD,
    {
        host: config.DB_HOST,
        port: config.DB_PORT,
        dialect: config.DB_DIALECT,
        engine: config.DB_ENGINE,
        dialectOptions: {
          charset: config.DB_CHARSET,
        },
        logging: false
  }
);

const User = sequelize.define('user', {
    id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true
    },
        fullname: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
        email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
        gender: {
        type: DataTypes.ENUM('M','F'),
        allowNull: true
    },
        created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
        updated_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'user'
});
  
User.prototype.getUser = function getUser({ fields } = {}) {
    const data = {
      id: this.getDataValue('id'),
      fullname: this.getDataValue('fullname'),
      email: this.getDataValue('email'),
      gender: this.getDataValue('gender'),
      created_at: this.getDataValue('created_at'),
      updated_at: this.getDataValue('updated_at')
    };
    /**
     * Pick a set of column names or fields to return from data when fields object is defined.
     */
    if (fields && Array.isArray(fields)) {
      return _.pick(data, fields);
    }
    /**
     * Display all fields by default
     */
    return data;
};

function getUserProfile(options) {
    const { userId, email, fields } = options;
    const andOptions = {};
  
    if (userId) {
      andOptions['id'] = userId;
    }
  
    if (email) {
      andOptions['email'] = email;
    }
  
    return User.findOne({
      where: {
        ...andOptions
      }
    }).then(user => {
      if (user) {
        return user.getUser({ fields });
      }
      return null;
    });
}

function createUser({ userProfile }) {
    /**
     * If you are using this for production, make sure to validate and sanitize all inputs  
     */
    const userId = uuid4(); // generate a new userId
    const currentDateTime = new Date();
    
    return User.create({
        id: userId,
        ...userProfile,
        last_login: currentDateTime,
        created_at: currentDateTime
    }).then(function(result) {
        return result;
    });
}

function updateUser({ updateData, userId }) {
    const parsedUpdateData = {};
    _.keys(updateData).forEach(key => {
        parsedUpdateData[key] = updateData[key];
    });
    
    return User.update(parsedUpdateData, { 
      where: {
        id: {
            [Op.eq] : userId 
        } 
      }
    }).then(
      ([affectedCount]) => {
        if (affectedCount) {
            return getUserProfile({ userId });
        }
        return null;
      }
    );
}
  
function deleteUser({ userId }) {
    return User.destroy({
      where: {
        id: userId
      }
    });
}

module.exports = {
    getUserProfile,
    createUser, 
    updateUser,
    deleteUser
};