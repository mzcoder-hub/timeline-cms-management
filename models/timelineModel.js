// backend/models/timelineModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Timeline = sequelize.define('Timeline', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId : {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true
  });

sequelize.sync();

module.exports = Timeline;


