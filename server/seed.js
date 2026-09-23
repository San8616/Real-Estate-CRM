import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records in reverse order
  await prisma.booking.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.building.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const agentPasswordHash = await bcrypt.hash('agent123', 10);

  const sarah = await prisma.user.create({
    data: {
      id: 'USR-001',
      name: 'Sarah Jenkins',
      email: 'admin@estatecrm.com',
      passwordHash: adminPasswordHash,
      role: 'Admin',
      title: 'Principal Broker & Managing Director',
      avatar: 'SJ',
      avatarBg: 'bg-gradient-to-tr from-indigo-600 to-violet-600',
      phone: '+1 (555) 100-2001',
      isActive: true,
    },
  });

  const michael = await prisma.user.create({
    data: {
      id: 'USR-002',
      name: 'Michael Scott',
      email: 'agent@estatecrm.com',
      passwordHash: agentPasswordHash,
      role: 'Sales Employee',
      title: 'Senior Realtor',
      avatar: 'MS',
      avatarBg: 'bg-gradient-to-tr from-emerald-600 to-teal-600',
      phone: '+1 (555) 100-2002',
      isActive: true,
    },
  });

  const elena = await prisma.user.create({
    data: {
      id: 'USR-003',
      name: 'Elena Rostova',
      email: 'elena@estatecrm.com',
      passwordHash: agentPasswordHash,
      role: 'Sales Employee',
      title: 'Luxury Specialist',
      avatar: 'ER',
      avatarBg: 'bg-gradient-to-tr from-purple-600 to-pink-600',
      phone: '+1 (555) 100-2003',
      isActive: true,
    },
  });

  const david = await prisma.user.create({
    data: {
      id: 'USR-004',
      name: 'David Vance',
      email: 'david@estatecrm.com',
      passwordHash: agentPasswordHash,
      role: 'Sales Employee',
      title: 'Commercial Associate',
      avatar: 'DV',
      avatarBg: 'bg-gradient-to-tr from-amber-600 to-orange-600',
      phone: '+1 (555) 100-2004',
      isActive: true,
    },
  });



  // 3. Seed Projects
  const sovereignHeights = await prisma.project.create({
    data: {
      name: 'Sovereign Heights',
      code: 'PRJ-SH',
      projectType: 'Residential',
      location: 'Downtown Core, Manhattan',
      city: 'New York',
      state: 'NY',
      description: 'Ultra-luxury high-rise tower with panoramic skyline and river vistas.',
    },
  });

  const azureBay = await prisma.project.create({
    data: {
      name: 'Azure Bay Community',
      code: 'PRJ-AB',
      projectType: 'Residential',
      location: 'Azure Bay Drive',
      city: 'Miami',
      state: 'FL',
      description: 'Private waterfront gated community with infinity pools and yacht slips.',
    },
  });

  const sohoDistrict = await prisma.project.create({
    data: {
      name: 'SoHo Commercial Loft Enclave',
      code: 'PRJ-SOHO',
      projectType: 'Commercial',
      location: 'SoHo District',
      city: 'New York',
      state: 'NY',
      description: 'Historical cast-iron architecture re-imagined for commercial enterprise.',
    },
  });

  const grandHorizon = await prisma.project.create({
    data: {
      name: 'Grand Horizon Tower',
      code: 'PRJ-GH',
      projectType: 'Mixed-Use',
      location: 'Grand Horizon Tower',
      city: 'Los Angeles',
      state: 'CA',
      description: 'Iconic Los Angeles skyscraper with 360-degree Pacific ocean and hill views.',
    },
  });

  // 4. Seed Buildings
  const tower1 = await prisma.building.create({
    data: {
      projectId: sovereignHeights.id,
      name: 'Tower 1 - Sovereign Heights',
      totalFloors: 50,
      totalUnits: 120,
    },
  });

  const azureVillas = await prisma.building.create({
    data: {
      projectId: azureBay.id,
      name: 'Azure Bay Villas - Sector A',
      totalFloors: 2,
      totalUnits: 24,
    },
  });

  const ghTowerA = await prisma.building.create({
    data: {
      projectId: grandHorizon.id,
      name: 'Grand Horizon West Tower',
      totalFloors: 45,
      totalUnits: 90,
    },
  });

  // 5. Seed Units (Normalized Properties)
  const unitsData = [
    {
      unitCode: 'PR-201',
      name: 'Penthouse at Sovereign Heights',
      unitType: 'Penthouse',
      location: 'Downtown Core, Manhattan, NY',
      price: 4850000,
      status: 'Active',
      assignedAgentId: sarah.id,
      projectId: sovereignHeights.id,
      buildingId: tower1.id,
      bedrooms: 4,
      bathrooms: 4,
      areaSqFt: 4200,
      listedDate: '2026-09-01',
      description: 'Stunning full-floor penthouse with panoramic skyline views, chef kitchen, private terrace, and concierge building services.',
    },
    {
      unitCode: 'PR-202',
      name: 'Modern Villa – Azure Bay',
      unitType: 'Villa',
      location: 'Azure Bay Drive, Miami, FL',
      price: 2900000,
      status: 'Active',
      assignedAgentId: elena.id,
      projectId: azureBay.id,
      buildingId: azureVillas.id,
      bedrooms: 5,
      bathrooms: 5,
      areaSqFt: 6100,
      listedDate: '2026-08-15',
      description: 'Waterfront luxury villa with infinity pool, private dock, designer interiors, and smart home automation throughout.',
    },
    {
      unitCode: 'PR-203',
      name: 'Downtown Commercial Loft',
      unitType: 'Commercial',
      location: 'SoHo District, New York, NY',
      price: 1250000,
      status: 'Pending',
      assignedAgentId: elena.id,
      projectId: sohoDistrict.id,
      buildingId: null,
      bedrooms: 0,
      bathrooms: 2,
      areaSqFt: 3400,
      listedDate: '2026-09-10',
      description: 'Open-plan commercial loft in prime SoHo location. High ceilings, exposed brick, ideal for boutique office or creative studio.',
    },
    {
      unitCode: 'PR-204',
      name: 'Oakridge Family Residence',
      unitType: 'Townhouse',
      location: 'Oakridge Lane, Chicago, IL',
      price: 1495000,
      status: 'Active',
      assignedAgentId: michael.id,
      projectId: null,
      buildingId: null,
      bedrooms: 4,
      bathrooms: 3,
      areaSqFt: 3800,
      listedDate: '2026-09-05',
      description: 'Spacious family townhouse with mature landscaping, attached garage, gourmet kitchen, and easy access to top-rated schools.',
    },
    {
      unitCode: 'PR-205',
      name: 'Harborview Waterfront Lot 12',
      unitType: 'Plot / Land',
      location: 'Harborview Estates, Seattle, WA',
      price: 3100000,
      status: 'Pending',
      assignedAgentId: david.id,
      projectId: null,
      buildingId: null,
      bedrooms: 0,
      bathrooms: 0,
      areaSqFt: 18500,
      listedDate: '2026-08-28',
      description: 'Rare waterfront development lot with planning permission approved for a 7,000 sq ft custom estate. Unobstructed harbor views.',
    },
    {
      unitCode: 'PR-206',
      name: 'Grand Horizon Penthouse 18B',
      unitType: 'Penthouse',
      location: 'Grand Horizon Tower, Los Angeles, CA',
      price: 5200000,
      status: 'Active',
      assignedAgentId: elena.id,
      projectId: grandHorizon.id,
      buildingId: ghTowerA.id,
      bedrooms: 5,
      bathrooms: 5,
      areaSqFt: 5100,
      listedDate: '2026-09-12',
      description: 'Iconic penthouse residence with private elevator, rooftop garden, wine cellar, and sweeping Pacific views from every room.',
    },
    {
      unitCode: 'PR-207',
      name: 'Silicon Hills Smart Home',
      unitType: 'Villa',
      location: 'Silicon Hills, Austin, TX',
      price: 1850000,
      status: 'Active',
      assignedAgentId: michael.id,
      projectId: null,
      buildingId: null,
      bedrooms: 4,
      bathrooms: 4,
      areaSqFt: 4600,
      listedDate: '2026-09-08',
      description: 'Architect-designed smart home with solar roof, EV infrastructure, home server room, and integrated HVAC/security systems.',
    },
    {
      unitCode: 'PR-208',
      name: 'Victorian Historic Townhouse',
      unitType: 'Townhouse',
      location: 'Heritage Quarter, San Francisco, CA',
      price: 1180000,
      status: 'Active',
      assignedAgentId: sarah.id,
      projectId: null,
      buildingId: null,
      bedrooms: 3,
      bathrooms: 2,
      areaSqFt: 2650,
      listedDate: '2026-09-03',
      description: 'Meticulously restored Victorian gem with original period details, modern updates, walkable neighborhood, and bay views.',
    },
    {
      unitCode: 'PR-209',
      name: 'West End Multi-Family Duplex',
      unitType: 'Commercial',
      location: 'West End District, Boston, MA',
      price: 2200000,
      status: 'Sold',
      assignedAgentId: david.id,
      projectId: null,
      buildingId: null,
      bedrooms: 6,
      bathrooms: 4,
      areaSqFt: 5200,
      listedDate: '2026-07-20',
      description: 'Fully-tenanted income-generating duplex. Cap rate of 8.1%. Separately metered utilities and full inspection report available.',
    },
    {
      unitCode: 'PR-210',
      name: 'Seaside Bluff Estate Unit 2',
      unitType: 'Villa',
      location: 'Seaside Bluff Road, Malibu, CA',
      price: 3750000,
      status: 'Sold',
      assignedAgentId: sarah.id,
      projectId: null,
      buildingId: null,
      bedrooms: 5,
      bathrooms: 5,
      areaSqFt: 6800,
      listedDate: '2026-08-01',
      description: 'Breathtaking bluff-top estate with private beach access, resort-style pool, cabana, and 270-degree ocean panorama.',
    },
    {
      unitCode: 'PR-211',
      name: 'Cedar Grove Suburban Home',
      unitType: 'Apartment',
      location: 'Cedar Grove, Portland, OR',
      price: 875000,
      status: 'Off Market',
      assignedAgentId: michael.id,
      projectId: null,
      buildingId: null,
      bedrooms: 3,
      bathrooms: 2,
      areaSqFt: 2100,
      listedDate: '2026-08-22',
      description: 'Charming corner apartment in quiet suburban community. Large balcony, updated kitchen, underground parking included.',
    },
    {
      unitCode: 'PR-212',
      name: 'Midtown Glass Tower Residence',
      unitType: 'Apartment',
      location: 'Midtown East, New York, NY',
      price: 1650000,
      status: 'Active',
      assignedAgentId: elena.id,
      projectId: sovereignHeights.id,
      buildingId: tower1.id,
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1850,
      listedDate: '2026-09-15',
      description: 'Floor-to-ceiling glass residence in prestigious tower. Concierge, rooftop terrace, gym, and direct Midtown access.',
    },
    {
      unitCode: 'PR-213',
      name: 'Meadowbrook Equestrian Ranch',
      unitType: 'Plot / Land',
      location: 'Meadowbrook Ranch, Scottsdale, AZ',
      price: 5800000,
      status: 'Active',
      assignedAgentId: david.id,
      projectId: null,
      buildingId: null,
      bedrooms: 6,
      bathrooms: 6,
      areaSqFt: 52000,
      listedDate: '2026-09-02',
      description: '10-acre working equestrian ranch with 6-stall barn, riding arena, guest cottage, caretaker suite, and mountain views.',
    },
    {
      unitCode: 'PR-214',
      name: 'Skyline Terrace Condo 14A',
      unitType: 'Apartment',
      location: 'Skyline Terrace, Denver, CO',
      price: 1100000,
      status: 'Active',
      assignedAgentId: sarah.id,
      projectId: null,
      buildingId: null,
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1620,
      listedDate: '2026-09-18',
      description: 'Modern corner condo with wrap-around terrace, mountain views, open kitchen, and premium building amenities.',
    },
  ];

  const createdUnits = {};
  for (const u of unitsData) {
    const unit = await prisma.unit.create({ data: u });
    createdUnits[u.unitCode] = unit;
  }

  // 6. Seed Leads
  const leadsData = [
    {
      leadCode: 'LD-101',
      name: 'Alexander Wright',
      phone: '+1 (555) 234-8901',
      email: 'alex.wright@example.com',
      stage: 'Negotiation',
      assignedAgentId: sarah.id,
      followUpDate: '2026-09-22',
      status: 'Hot Lead',
      propertyInterest: 'Penthouse at Sovereign Heights',
      budget: '$1,850,000',
      notes: 'Interested in closing before Q4. Waiting on seller concession response.',
      source: 'Zillow Premier',
    },
    {
      leadCode: 'LD-102',
      name: 'Evelyn Carter',
      phone: '+1 (555) 345-6712',
      email: 'evelyn.c@example.com',
      stage: 'Site Visit',
      assignedAgentId: sarah.id,
      followUpDate: '2026-09-21',
      status: 'Active',
      propertyInterest: 'Modern Villa - Azure Bay',
      budget: '$2,400,000',
      notes: 'Tour confirmed for today at 2:30 PM with architect spouse.',
      source: 'Website Form',
    },
    {
      leadCode: 'LD-103',
      name: 'Marcus Chen',
      phone: '+1 (555) 456-7823',
      email: 'marcus.chen@example.com',
      stage: 'Contacted',
      assignedAgentId: elena.id,
      followUpDate: '2026-09-23',
      status: 'Follow-up Needed',
      propertyInterest: 'Downtown Commercial Loft',
      budget: '$950,000',
      notes: 'Pre-approved with Chase for up to $1.1M. Needs high ceilings.',
      source: 'Referral',
    },
    {
      leadCode: 'LD-104',
      name: 'Sophia Martinez',
      phone: '+1 (555) 567-8934',
      email: 'sophia.m@example.com',
      stage: 'New',
      assignedAgentId: michael.id,
      followUpDate: '2026-09-21',
      status: 'Hot Lead',
      propertyInterest: 'Oakridge Family Residence',
      budget: '$1,200,000',
      notes: 'Relocating from Chicago next month. Cash buyer ready to move fast.',
      source: 'Instagram Ad',
    },
    {
      leadCode: 'LD-105',
      name: 'James Harrington',
      phone: '+1 (555) 678-9045',
      email: 'j.harrington@estateco.net',
      stage: 'Booked',
      assignedAgentId: david.id,
      followUpDate: '2026-09-25',
      status: 'Active',
      propertyInterest: 'Harborview Waterfront Lot 12',
      budget: '$3,100,000',
      notes: 'Title search completed. Escrow deposit verified with First National.',
      source: 'Private Broker Network',
    },
    {
      leadCode: 'LD-106',
      name: 'Victoria Sterling',
      phone: '+1 (555) 789-0156',
      email: 'victoria.sterling@vanguard.io',
      stage: 'Site Visit',
      assignedAgentId: elena.id,
      followUpDate: '2026-09-24',
      status: 'Active',
      propertyInterest: 'Grand Horizon Penthouse 18B',
      budget: '$5,500,000',
      notes: 'Celebrity client representative. Requires strict non-disclosure agreement before showing.',
      source: 'Direct Outreach',
    },
    {
      leadCode: 'LD-107',
      name: 'Harrison Ford-Ellis',
      phone: '+1 (555) 890-1267',
      email: 'harrison.fe@apexinvest.co',
      stage: 'Interested',
      assignedAgentId: david.id,
      followUpDate: '2026-09-22',
      status: 'Hot Lead',
      propertyInterest: 'West End Multi-Family Duplex',
      budget: '$2,300,000',
      notes: '1031 exchange funds must be identified within 28 days. Looking for 7%+ cap rate.',
      source: 'Commercial MLS',
    },
    {
      leadCode: 'LD-108',
      name: 'Chloe Davenport',
      phone: '+1 (555) 901-2378',
      email: 'chloe.davenport@gmail.com',
      stage: 'New',
      assignedAgentId: michael.id,
      followUpDate: '2026-09-26',
      status: 'Cold',
      propertyInterest: 'Cedar Grove Suburban Home',
      budget: '$850,000',
      notes: 'First-time home buyer. Requested brochure on FHA loan options and HOA rules.',
      source: 'Open House Walk-in',
    },
  ];

  const createdLeads = {};
  for (const l of leadsData) {
    const lead = await prisma.lead.create({ data: l });
    createdLeads[l.leadCode] = lead;
  }

  // 7. Seed Bookings
  const bookingsData = [
    {
      bookingCode: 'BK-501',
      leadId: createdLeads['LD-101'].id,
      unitId: createdUnits['PR-201'].id,
      bookingType: 'Unit Reservation',
      bookingDate: '2026-09-23',
      bookingTime: '10:30 AM',
      status: 'Confirmed',
      assignedAgentId: sarah.id,
      tokenAmount: '$50,000',
      notes: 'Earnest deposit escrow initiated with First American Title. Final closing review scheduled.',
    },
    {
      bookingCode: 'BK-502',
      leadId: createdLeads['LD-102'].id,
      unitId: createdUnits['PR-202'].id,
      bookingType: 'Site Visit',
      bookingDate: '2026-09-22',
      bookingTime: '02:00 PM',
      status: 'Confirmed',
      assignedAgentId: elena.id,
      tokenAmount: '—',
      notes: 'Architect spouse attending tour. Requires gate access code from association concierge.',
    },
    {
      bookingCode: 'BK-503',
      leadId: createdLeads['LD-103'].id,
      unitId: createdUnits['PR-203'].id,
      bookingType: 'Contract Signing',
      bookingDate: '2026-09-24',
      bookingTime: '12:00 PM',
      status: 'Pending',
      assignedAgentId: elena.id,
      tokenAmount: '$25,000',
      notes: 'Awaiting attorney review on commercial zoning addendum.',
    },
    {
      bookingCode: 'BK-504',
      leadId: createdLeads['LD-104'].id,
      unitId: createdUnits['PR-204'].id,
      bookingType: 'Site Visit',
      bookingDate: '2026-09-22',
      bookingTime: '03:30 PM',
      status: 'Confirmed',
      assignedAgentId: michael.id,
      tokenAmount: '—',
      notes: 'Relocating family. Interested in local public school district boundaries.',
    },
    {
      bookingCode: 'BK-505',
      leadId: createdLeads['LD-105'].id,
      unitId: createdUnits['PR-205'].id,
      bookingType: 'Unit Reservation',
      bookingDate: '2026-09-25',
      bookingTime: '09:00 AM',
      status: 'Confirmed',
      assignedAgentId: david.id,
      tokenAmount: '$100,000',
      notes: 'Surveyor packet delivered. Environmental soil assessment completed.',
    },
    {
      bookingCode: 'BK-506',
      leadId: createdLeads['LD-106'].id,
      unitId: createdUnits['PR-206'].id,
      bookingType: 'Virtual Walkthrough',
      bookingDate: '2026-09-21',
      bookingTime: '05:00 PM',
      status: 'Completed',
      assignedAgentId: elena.id,
      tokenAmount: '—',
      notes: 'High-definition 3D tour conducted. Lead requested in-person private inspection next week.',
    },
    {
      bookingCode: 'BK-507',
      leadId: createdLeads['LD-101'].id,
      unitId: createdUnits['PR-207'].id,
      bookingType: 'Site Visit',
      bookingDate: '2026-09-14',
      bookingTime: '10:30 AM',
      status: 'Cancelled',
      assignedAgentId: michael.id,
      tokenAmount: '—',
      notes: 'Buyer rescheduled preference toward Manhattan luxury penthouse.',
    },
  ];

  for (const b of bookingsData) {
    await prisma.booking.create({ data: b });
  }

  console.log('✅ Database successfully seeded!');
  console.log('   Users: 4');
  console.log('   Projects: 4');
  console.log('   Buildings: 3');
  console.log('   Units: 14');
  console.log('   Leads: 8');
  console.log('   Bookings: 7');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
