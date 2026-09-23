export const ROLES = {
  ADMIN: 'Admin',
  SALES_EMPLOYEE: 'Sales Employee',
};

export const MOCK_USERS = [
  {
    id: 'USR-001',
    name: 'Sarah Jenkins',
    email: 'admin@estatecrm.com',
    password: 'admin123',
    role: ROLES.ADMIN,
    title: 'Principal Broker & Managing Director',
    avatar: 'SJ',
    avatarBg: 'bg-gradient-to-tr from-indigo-600 to-violet-600',
    permissions: [
      'manage_all',
      'delete_leads',
      'delete_properties',
      'delete_bookings',
      'manage_team',
      'view_reports',
      'settings',
    ],
  },
  {
    id: 'USR-002',
    name: 'Michael Scott',
    email: 'agent@estatecrm.com',
    password: 'agent123',
    role: ROLES.SALES_EMPLOYEE,
    title: 'Senior Sales Associate',
    avatar: 'MS',
    avatarBg: 'bg-gradient-to-tr from-emerald-600 to-teal-600',
    permissions: [
      'view_all',
      'create_leads',
      'edit_assigned',
      'create_bookings',
      'view_properties',
    ],
  },
];

/**
 * Authenticates a user against mock user data with simulated async network delay.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} resolved user object or rejects with error message
 */
export async function authenticateUser(email, password) {
  // Simulate network latency for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 600));

  const cleanEmail = email.trim().toLowerCase();
  const foundUser = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === password
  );

  if (!foundUser) {
    throw new Error('Invalid email or password. Please check your credentials and try again.');
  }

  // Return a copy without the password
  const { password: _p, ...safeUser } = foundUser;
  return safeUser;
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user, permission) {
  if (!user) return false;
  if (user.role === ROLES.ADMIN) return true;
  return user.permissions?.includes(permission) || false;
}
