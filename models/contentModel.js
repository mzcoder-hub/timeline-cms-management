// backend/models/contentModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Content = sequelize.define('Content', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status : {
      type : DataTypes.INTEGER,
      allowNull : false,
      defaultValue : false
    },
    timelineId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true
  });

sequelize.sync();

module.exports = Content;
