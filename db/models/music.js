'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Music extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.User, {
        through: models.Usermusic,
        foreignKey: 'music_id',
        onDelete: 'cascade', hooks:true //чтобы удалялись все связи и потом удалялся элемент. Писать везде, где есть связь(референс)
      });
    }
  }
  Music.init({
    tittle: DataTypes.STRING,
    description: DataTypes.TEXT,
    img: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Music',
  });
  return Music;
};
