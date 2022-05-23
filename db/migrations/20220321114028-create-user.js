'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
        //unique: true // чтобы не создавался пользователь с таким же именем
      },
      email: {
        type: Sequelize.STRING,
        unique: true, // чтобы не создавался пользователь с такой же почтой
        validate: {
         isEmail: true,
        },
        allowNull: false,
        },
      password: {
        type: Sequelize.STRING
      },
      groupname: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
