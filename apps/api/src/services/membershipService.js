import db from '../../models/index.js';

const { Membership, User, Company } = db;

export const assignMembershipToUser = async (userId, membershipId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  const membership = await Membership.findByPk(membershipId);
  if (!membership) {
    throw new Error('Membership not found');
  }

  user.membershipId = membershipId;
  await user.save();

  return user;
};

export const checkSubscriptionLimits = async (userId, type) => {
  const user = await User.findByPk(userId, { include: [Membership, Company] });
  if (!user) {
    throw new Error('User not found');
  }

  const membership = user.Membership;
  if (!membership) {
    throw new Error('Membership not assigned to user');
  }

  const company = user.Company;
  const models = await company.getModels();
  if (type === 'models' && models?.length > parseInt(membership.limits?.models)) {
    return false;
  }
  const datasets = await company.getDatasets();
  if (type === 'datasets' && datasets?.length > parseInt(membership.limits?.datasets)) {
    return false;
  }
  const reviewedEntries = await company.getReviewedEntriesMonth();
  if (type === 'entries' && reviewedEntries?.length > parseInt(membership.limits?.reviewedEntries)) {
    return false;
  }

  return true;
};
