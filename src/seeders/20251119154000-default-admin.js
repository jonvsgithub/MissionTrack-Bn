'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    const organizationId = '00000000-0000-0000-0000-000000000001';

    // Check if org exists before inserting
    const orgExists = await queryInterface.sequelize.query(
      'SELECT id FROM organizations WHERE id = ?',
      { replacements: [organizationId], type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (orgExists.length === 0) {
      await queryInterface.bulkInsert('organizations', [
        {
          id: organizationId,
          name: 'MissionTrack HQ',
          province: 'HQ',
          district: 'HQ',
          sector: 'Technology',
          email: 'hq@missiontrack.com',
          phone: '+250700000000',
          proofDocument: null,
          contactPersonName: 'Admin',
          contactPersonPhone: '+250700000000',
          contactPersonEmail: 'admin@missiontrack.com',
          passwordHash,
          status: 'approved',
          createdByAdminId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }

    // Check if admin user exists before inserting
    const adminExists = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE email = ?',
      { replacements: ['admin@missiontrack.com'], type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (adminExists.length === 0) {
      await queryInterface.bulkInsert('users', [
        {
          id: '00000000-0000-0000-0000-000000000002',
          organizationId,
          fullName: 'Super Admin',
          email: 'admin@missiontrack.com',
          passwordHash,
          phone: '+250700000000',
          department: 'Executive',
          role: 'admin',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '00000000-0000-0000-0000-000000000003',
          organizationId,
          fullName: 'Manager User',
          email: 'manager@missiontrack.com',
          passwordHash,
          phone: '+250700000001',
          department: 'Operations',
          role: 'manager',
          status: 'disabled',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@missiontrack.com' });
    await queryInterface.bulkDelete('organizations', { email: 'hq@missiontrack.com' });
  }
};

