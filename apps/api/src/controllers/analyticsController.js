import jwt from 'jsonwebtoken';
import db from '../../models/index.js';
import bcrypt from 'bcryptjs';
import { analyticsClient } from '../services/data/analytics.js';

const { AnalyticsLog } = db;

// Sign up function
export const sync = async (req, res) => {
  const request = {
    property: 'properties/467628340',
    dimensions: [
      { name: 'eventName' },
      { name: 'date' },
      { name: 'customEvent:user' },
    ],
    metrics: [
      { name: 'eventCount' },
      { name: 'activeUsers' },
      { name: 'sessions' },
    ],
    dateRanges: [{ startDate: 'yesterday', endDate: 'today' }],
  };

  try {
    const [response] = await analyticsClient.runReport(request);

    const rows = response.rows.map((row) => {
      const date = row.dimensionValues[1].value;
      // parse date yyyymmdd to real date
      const year = date.slice(0, 4);
      const month = date.slice(4, 6);
      const day = date.slice(6, 8);
      
      return (
      {
        eventName: row.dimensionValues[0].value,
        date: year + '-' + month + '-' + day,
        userId: row.dimensionValues[2].value,
        eventCount: row.metricValues[0].value,
        activeUsers: row.metricValues[1].value,
        sessions: row.metricValues[2].value,
      }
    )}
  );
    const filteredRows = rows.filter((row) => row.userId !== '(not set)' && row.userId !== '');
    // only create unique logs checking for date event name and user id in db
    const uniqueLogs = []

    for (const row of filteredRows) {
      const existingLog = await AnalyticsLog.findOne({
        where: {
          date: row.date,
          eventName: row.eventName,
          userId: parseInt(row.userId),
        },
      });

      if (!existingLog) {
        uniqueLogs.push({
          ...row,
          userId: parseInt(row.userId),
          eventCount: parseInt(row.eventCount),
          activeUsers: parseInt(row.activeUsers),
          sessions: parseInt(row.sessions),
        });
      }
    }
    await AnalyticsLog.bulkCreate(uniqueLogs);
  } catch (error) {
    console.error(error);
  } finally {
    console.log('Sync completed');
    res.status(201).json({ message: 'Sync completed' });
  }
};
