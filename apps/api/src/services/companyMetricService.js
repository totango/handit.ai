import db from '../../models/index.js';

const { CompanyMetric, CompanyMetricLog } = db;

export const getCompanyMetricsOfCompany = async (companyId) => {
  const companyMetrics = await CompanyMetric.findAll({ where: { companyId } });
  // get last company metric logs of each company metric
  const companyMetricIds = companyMetrics.map(
    (companyMetric) => companyMetric.id
  );
  const companyMetricLogs = await CompanyMetricLog.findAll({
    where: { companyMetricId: companyMetricIds },
    order: [['created_at', 'DESC']],
  });

  const maxIds = companyMetricLogs.reduce((acc, companyMetricLog) => {
    if (!acc[companyMetricLog.companyMetricId]) {
      acc[companyMetricLog.companyMetricId] = companyMetricLog.id;
    }
    return acc;
  }, {});

  const companyMetricLogsByCompanyMetricId = companyMetricLogs.reduce(
    (acc, companyMetricLog) => {
      if (companyMetricLog.id === maxIds[companyMetricLog.companyMetricId]) {
        acc[companyMetricLog.companyMetricId] = companyMetricLog;
      }
      return acc;
    },
    {}
  );

  return companyMetrics.map((companyMetric) => {
    const companyMetricLog =
      companyMetricLogsByCompanyMetricId[companyMetric.id];
    return {
      ...companyMetric.toJSON(),
      companyMetricLog: companyMetricLog ? companyMetricLog.toJSON() : null,
      lastCompanyMetricLogTime: companyMetricLog
        ? companyMetricLog.createdAt
        : null,
    };
  });
};
