'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usermusics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'cascade', hooks:true //чтобы удалялись все связи и потом удалялся элемент. Писать везде, где есть связь(референс)
      },
      music_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Music',
          key: 'id'
        },
        onDelete: 'cascade', hooks:true //чтобы удалялись все связи и потом удалялся элемент. Писать везде, где есть связь(референс)
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
    await queryInterface.dropTable('Usermusics');
  }
};
