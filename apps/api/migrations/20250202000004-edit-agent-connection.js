'use strict';

import { Sequelize } from 'sequelize';

export const up = async (queryInterface) => {
  await queryInterface.addColumn('AgentConnections', 'output_name', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'output'
  });
  
  await queryInterface.addColumn('AgentConnections', 'input_name', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'input'
  });
};

export const down = async (queryInterface) => {
  await queryInterface.removeColumn('AgentConnections', 'output_name');
  await queryInterface.removeColumn('AgentConnections', 'input_name');
};
