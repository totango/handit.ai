// Function to generate a detailed alert for a single alert view
export const processUsersSandboxRequest = (args) => {
  let { url } = args;
  if (typeof args === 'string') {
    url = args;
  }

  if (url === ('/users/me')) {
    return {data: {
      id: 1,
      firstName: 'Sandbox',
      lastName: 'User',
      phoneNumber: null,
      title: null,
      email: 'sandbox@user.com',
      role: 'user',
      ssoLogin: null,
      companyId: 13,
      deletedAt: null,
      membershipId: 1,
      createdAt: '2024-11-05T19:04:34.688Z',
      updatedAt: '2024-11-05T19:04:34.688Z',
      company_id: 13,
      company: {
        id: 13,
        name: 'test test',
        location: null,
        icon: null,
        url: null,
        nationalId: 'test@gmail.com',
        apiToken: 'test_sandbox_key',
        deletedAt: null,
        createdAt: '2024-11-05T19:04:34.521Z',
        updatedAt: '2024-11-05T19:04:34.521Z',
      },
    }
  }}
};
