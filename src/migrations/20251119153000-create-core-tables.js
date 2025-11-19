'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organizations', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      province: { type: Sequelize.STRING, allowNull: false },
      district: { type: Sequelize.STRING, allowNull: false },
      sector: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      phone: { type: Sequelize.STRING, allowNull: false },
      proofDocument: { type: Sequelize.STRING },
      contactPersonName: { type: Sequelize.STRING, allowNull: false },
      contactPersonPhone: { type: Sequelize.STRING, allowNull: false },
      contactPersonEmail: { type: Sequelize.STRING, allowNull: false },
      passwordHash: { type: Sequelize.STRING, allowNull: false },
      status: { type: Sequelize.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
      createdByAdminId: { type: Sequelize.UUID, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      organizationId: {
        type: Sequelize.UUID,
        references: { model: 'organizations', key: 'id' },
        onDelete: 'SET NULL'
      },
      fullName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      passwordHash: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING },
      department: { type: Sequelize.STRING },
      role: { type: Sequelize.ENUM('employee', 'manager', 'hr', 'finance', 'admin'), allowNull: false },
      status: { type: Sequelize.ENUM('active', 'disabled'), defaultValue: 'active' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('missions', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      organizationId: {
        type: Sequelize.UUID,
        references: { model: 'organizations', key: 'id' },
        onDelete: 'SET NULL'
      },
      purpose: { type: Sequelize.STRING, allowNull: false },
      destination: { type: Sequelize.STRING, allowNull: false },
      startDate: { type: Sequelize.DATEONLY, allowNull: false },
      endDate: { type: Sequelize.DATEONLY, allowNull: false },
      duration: { type: Sequelize.INTEGER, allowNull: false },
      estimatedCost: { type: Sequelize.FLOAT, allowNull: false },
      status: {
        type: Sequelize.ENUM('pending_manager', 'pending_hr', 'pending_finance', 'approved', 'rejected', 'completed'),
        defaultValue: 'pending_manager'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('mission_expenses', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      missionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'missions', key: 'id' },
        onDelete: 'CASCADE'
      },
      submittedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      expenseType: { type: Sequelize.STRING, allowNull: false },
      amount: { type: Sequelize.FLOAT, allowNull: false },
      receiptFile: { type: Sequelize.STRING },
      status: { type: Sequelize.ENUM('pending_finance', 'approved', 'rejected'), defaultValue: 'pending_finance' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('fund_allocations', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      missionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'missions', key: 'id' },
        onDelete: 'CASCADE'
      },
      allocatedAmount: { type: Sequelize.FLOAT, allowNull: false },
      allocatedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      status: { type: Sequelize.ENUM('pending', 'disbursed'), defaultValue: 'pending' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('notifications', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      title: { type: Sequelize.STRING, allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: false },
      isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('audit_logs', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      action: { type: Sequelize.STRING, allowNull: false },
      module: { type: Sequelize.STRING, allowNull: false },
      oldValue: { type: Sequelize.JSONB },
      newValue: { type: Sequelize.JSONB },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('mission_approval_histories', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      missionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'missions', key: 'id' },
        onDelete: 'CASCADE'
      },
      approverId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      role: { type: Sequelize.STRING, allowNull: false },
      action: { type: Sequelize.ENUM('approved', 'rejected'), allowNull: false },
      comment: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('mission_approval_histories');
    await queryInterface.dropTable('audit_logs');
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('fund_allocations');
    await queryInterface.dropTable('mission_expenses');
    await queryInterface.dropTable('missions');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('organizations');
  }
};



