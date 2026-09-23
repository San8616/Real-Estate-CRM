import { SALES_AGENTS } from './mockLeads';

export const BOOKING_STATUSES = [
  'Confirmed',
  'Pending',
  'Completed',
  'Cancelled',
];

export const BOOKING_TYPES = [
  'Site Visit',
  'Unit Reservation',
  'Contract Signing',
  'Virtual Walkthrough',
];

export const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '12:00 PM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
];

export { SALES_AGENTS };

export const MOCK_BOOKINGS = [
  {
    id: 'BK-501',
    leadId: 'LD-101',
    leadName: 'Alexander Wright',
    leadEmail: 'alex.wright@example.com',
    leadPhone: '+1 (555) 234-8901',
    propertyId: 'PR-201',
    propertyName: 'Penthouse at Sovereign Heights',
    propertyType: 'Penthouse',
    propertyLocation: 'Downtown Core, Manhattan, NY',
    propertyPrice: '$4,850,000',
    unitCode: 'PH-48',
    bookingType: 'Unit Reservation',
    bookingDate: '2026-09-23',
    bookingTime: '10:30 AM',
    status: 'Confirmed',
    assignedAgent: 'Sarah Jenkins',
    tokenAmount: '$50,000',
    notes: 'Earnest deposit escrow initiated with First American Title. Final closing review scheduled.',
    createdDate: '2026-09-18',
  },
  {
    id: 'BK-502',
    leadId: 'LD-102',
    leadName: 'Evelyn Carter',
    leadEmail: 'evelyn.c@example.com',
    leadPhone: '+1 (555) 345-6712',
    propertyId: 'PR-202',
    propertyName: 'Modern Villa – Azure Bay',
    propertyType: 'Villa',
    propertyLocation: 'Azure Bay Drive, Miami, FL',
    propertyPrice: '$2,900,000',
    unitCode: 'V-04',
    bookingType: 'Site Visit',
    bookingDate: '2026-09-22',
    bookingTime: '02:00 PM',
    status: 'Confirmed',
    assignedAgent: 'Elena Rostova',
    tokenAmount: '—',
    notes: 'Architect spouse attending tour. Requires gate access code from association concierge.',
    createdDate: '2026-09-19',
  },
  {
    id: 'BK-503',
    leadId: 'LD-103',
    leadName: 'Marcus Chen',
    leadEmail: 'marcus.chen@example.com',
    leadPhone: '+1 (555) 456-7823',
    propertyId: 'PR-203',
    propertyName: 'Downtown Commercial Loft',
    propertyType: 'Commercial',
    propertyLocation: 'SoHo District, New York, NY',
    propertyPrice: '$1,250,000',
    unitCode: 'Suite 4B',
    bookingType: 'Contract Signing',
    bookingDate: '2026-09-24',
    bookingTime: '12:00 PM',
    status: 'Pending',
    assignedAgent: 'Elena Rostova',
    tokenAmount: '$25,000',
    notes: 'Awaiting attorney review on commercial zoning addendum.',
    createdDate: '2026-09-20',
  },
  {
    id: 'BK-504',
    leadId: 'LD-104',
    leadName: 'Sophia Martinez',
    leadEmail: 'sophia.m@example.com',
    leadPhone: '+1 (555) 567-8934',
    propertyId: 'PR-204',
    propertyName: 'Oakridge Family Residence',
    propertyType: 'Townhouse',
    propertyLocation: 'Oakridge Lane, Chicago, IL',
    propertyPrice: '$1,495,000',
    unitCode: 'TH-12',
    bookingType: 'Site Visit',
    bookingDate: '2026-09-22',
    bookingTime: '03:30 PM',
    status: 'Confirmed',
    assignedAgent: 'Michael Scott',
    tokenAmount: '—',
    notes: 'Relocating family. Interested in local public school district boundaries.',
    createdDate: '2026-09-21',
  },
  {
    id: 'BK-505',
    leadId: 'LD-105',
    leadName: 'James Harrington',
    leadEmail: 'j.harrington@estateco.net',
    leadPhone: '+1 (555) 678-9045',
    propertyId: 'PR-205',
    propertyName: 'Harborview Waterfront Lot 12',
    propertyType: 'Plot / Land',
    propertyLocation: 'Harborview Estates, Seattle, WA',
    propertyPrice: '$3,100,000',
    unitCode: 'Lot 12',
    bookingType: 'Unit Reservation',
    bookingDate: '2026-09-25',
    bookingTime: '09:00 AM',
    status: 'Confirmed',
    assignedAgent: 'David Vance',
    tokenAmount: '$100,000',
    notes: 'Surveyor packet delivered. Environmental soil assessment completed.',
    createdDate: '2026-09-17',
  },
  {
    id: 'BK-506',
    leadId: 'LD-106',
    leadName: 'Victoria Sterling',
    leadEmail: 'victoria.sterling@vanguard.io',
    leadPhone: '+1 (555) 789-0156',
    propertyId: 'PR-206',
    propertyName: 'Grand Horizon Penthouse 18B',
    propertyType: 'Penthouse',
    propertyLocation: 'Grand Horizon Tower, Los Angeles, CA',
    propertyPrice: '$5,200,000',
    unitCode: 'PH-18B',
    bookingType: 'Virtual Walkthrough',
    bookingDate: '2026-09-21',
    bookingTime: '05:00 PM',
    status: 'Completed',
    assignedAgent: 'Elena Rostova',
    tokenAmount: '—',
    notes: 'High-definition 3D tour conducted. Lead requested in-person private inspection next week.',
    createdDate: '2026-09-15',
  },
  {
    id: 'BK-507',
    leadId: 'LD-101',
    leadName: 'Alexander Wright',
    leadEmail: 'alex.wright@example.com',
    leadPhone: '+1 (555) 234-8901',
    propertyId: 'PR-207',
    propertyName: 'Silicon Hills Smart Home',
    propertyType: 'Villa',
    propertyLocation: 'Silicon Hills, Austin, TX',
    propertyPrice: '$1,850,000',
    unitCode: 'Villa A',
    bookingType: 'Site Visit',
    bookingDate: '2026-09-14',
    bookingTime: '10:30 AM',
    status: 'Cancelled',
    assignedAgent: 'Michael Scott',
    tokenAmount: '—',
    notes: 'Buyer rescheduled preference toward Manhattan luxury penthouse.',
    createdDate: '2026-09-10',
  },
];

/**
 * Checks if a property unit is currently booked under an active booking
 * (status is 'Confirmed' or 'Pending'). Completed or Cancelled bookings release the unit.
 *
 * @param {string} propertyId
 * @param {Array} bookings
 * @param {string|null} excludeBookingId (optional booking ID being edited)
 * @returns {object|null} existing booking if unit is currently booked, otherwise null
 */
export function getActiveBookingForUnit(propertyId, bookings = [], excludeBookingId = null) {
  if (!propertyId) return null;
  return bookings.find(
    (b) =>
      b.propertyId === propertyId &&
      b.id !== excludeBookingId &&
      (b.status === 'Confirmed' || b.status === 'Pending')
  ) || null;
}

/**
 * Returns set of all property IDs that have active bookings
 */
export function getBookedPropertyIds(bookings = [], excludeBookingId = null) {
  const ids = new Set();
  bookings.forEach((b) => {
    if (
      b.propertyId &&
      b.id !== excludeBookingId &&
      (b.status === 'Confirmed' || b.status === 'Pending')
    ) {
      ids.add(b.propertyId);
    }
  });
  return ids;
}
