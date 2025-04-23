import db from '../../models/index.js';

const { Company } = db;
export const getDashboardMetrics = async (req, res) => {
  const { userObject } = req;
  const companyId = userObject.companyId;
  const company = await Company.findByPk(companyId);
  const criticalAlertsLast30Days = await company.criticalAlertsLast30Days();
  const infoAlertsLast30Days = await company.infoAlertsLast30Days();
  const modelLogsLast30Days = await company.modelLogsLast30Days();
  const alertsGroupedByDayLast30Days = await company.alertsGroupedByDayLast30Days();
  const errorAlertsLast30Days = await company.errorAlertsLast30Days();
  const oneMonthDate = new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
  // date minus 30 days
  const criticalAlertsOneMonthAgo = await company.criticalAlertsLast30Days(oneMonthDate);
  const infoAlertsOneMonthAgo = await company.infoAlertsLast30Days(oneMonthDate);
  const modelLogsOneMonthAgo = await company.modelLogsLast30Days(oneMonthDate);
  const errorAlertsOneMonthAgo = await company.errorAlertsLast30Days(oneMonthDate);

  const criticalAlertsChange = criticalAlertsLast30Days.length - criticalAlertsOneMonthAgo.length;
  const infoAlertsChange = infoAlertsLast30Days.length - infoAlertsOneMonthAgo.length;
  const modelLogsChange = modelLogsLast30Days - modelLogsOneMonthAgo;
  const errorAlertsChange = errorAlertsLast30Days.length - errorAlertsOneMonthAgo.length;
  res.status(200).json({
    criticalAlertsLast30Days,
    infoAlertsLast30Days,
    alertsGroupedByDayLast30Days,
    modelLogsLast30Days,
    criticalAlertsChange,
    infoAlertsChange,
    errorAlertsLast30Days,
    errorAlertsChange,
    modelLogsChange,
  });
}
