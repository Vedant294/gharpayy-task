import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Lead = Database['public']['Tables']['leads']['Row'];
type Agent = Database['public']['Tables']['agents']['Row'];
type Visit = Database['public']['Tables']['visits']['Row'];
type Property = Database['public']['Tables']['properties']['Row'];
type Booking = Database['public']['Tables']['bookings']['Row'];
type Conversation = Database['public']['Tables']['conversations']['Row'];
type FollowUp = Database['public']['Tables']['follow_up_reminders']['Row'];
type Room = Database['public']['Tables']['rooms']['Row'];
type Bed = Database['public']['Tables']['beds']['Row'];
type Zone = Database['public']['Tables']['zones']['Row'];
type TeamQueue = Database['public']['Tables']['team_queues']['Row'];

export const seedData = async () => {
  // Check if data already exists
  const { count: agentCount } = await supabase.from('agents').select('*', { count: 'exact', head: true });
  if (agentCount && agentCount > 0) {
    console.log('Seed data already exists');
    return;
  }

  console.log('Creating seed data...');

  // Create zones
  const zones: Zone[] = [
    { id: 'z1', name: 'Koramangala Zone', city: 'Bangalore', area_list: ['Koramangala', 'HSR Layout'], created_at: new Date().toISOString() },
    { id: 'z2', name: 'Whitefield Zone', city: 'Bangalore', area_list: ['Whitefield', 'Marathahalli'], created_at: new Date().toISOString() },
    { id: 'z3', name: 'BTM Zone', city: 'Bangalore', area_list: ['BTM Layout', 'JP Nagar'], created_at: new Date().toISOString() },
  ];

  await supabase.from('zones').insert(zones);

  // Create team queues
  const teamQueues: TeamQueue[] = [
    { id: 'tq1', zone_id: 'z1', team_name: 'Koramangala Team', owner_agent_id: null, member_ids: ['a1', 'a2'], dispatch_rule: 'round_robin', last_assigned_idx: 0, is_active: true, created_at: new Date().toISOString() },
    { id: 'tq2', zone_id: 'z2', team_name: 'Whitefield Team', owner_agent_id: null, member_ids: ['a3', 'a4'], dispatch_rule: 'round_robin', last_assigned_idx: 0, is_active: true, created_at: new Date().toISOString() },
    { id: 'tq3', zone_id: 'z3', team_name: 'BTM Team', owner_agent_id: null, member_ids: ['a1', 'a3'], dispatch_rule: 'round_robin', last_assigned_idx: 0, is_active: true, created_at: new Date().toISOString() },
  ];

  await supabase.from('team_queues').insert(teamQueues);

  // Create agents
  const agents: Agent[] = [
    { id: 'a1', name: 'Priya Sharma', email: 'priya@gharpayy.com', phone: '+91 9876543210', role: 'agent', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'a2', name: 'Rahul Verma', email: 'rahul@gharpayy.com', phone: '+91 8765432109', role: 'agent', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'a3', name: 'Anita Desai', email: 'anita@gharpayy.com', phone: '+91 7654321098', role: 'manager', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'a4', name: 'Vikram Singh', email: 'vikram@gharpayy.com', phone: '+91 6543210987', role: 'agent', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];

  await supabase.from('agents').insert(agents);

  // Create properties
  const properties: Property[] = [
    { id: 'p1', name: 'Gharpayy Residency - Indiranagar', address: '456 Indiranagar, Bangalore', city: 'Bangalore', area: 'Indiranagar', price_range: '₹12,000-18,000', is_active: true, created_at: new Date().toISOString() },
    { id: 'p2', name: 'Gharpayy Heights - Marathahalli', address: '789 Marathahalli, Bangalore', city: 'Bangalore', area: 'Marathahalli', price_range: '₹9,000-13,000', is_active: true, created_at: new Date().toISOString() },
    { id: 'p3', name: 'Gharpayy Villa - Whitefield', address: '123 Whitefield, Bangalore', city: 'Bangalore', area: 'Whitefield', price_range: '₹10,000-15,000', is_active: true, created_at: new Date().toISOString() },
    { id: 'p4', name: 'Gharpayy Homes - BTM', address: '321 BTM Layout, Bangalore', city: 'Bangalore', area: 'BTM Layout', price_range: '₹8,000-11,000', is_active: true, created_at: new Date().toISOString() },
    { id: 'p5', name: 'Gharpayy Nest - Electronic City', address: '456 Electronic City, Bangalore', city: 'Bangalore', area: 'Electronic City', price_range: '₹7,000-10,000', is_active: true, created_at: new Date().toISOString() },
  ];

  await supabase.from('properties').insert(properties);

  // Create rooms
  const rooms: Room[] = [
    { id: 'r1', property_id: 'p1', room_number: '101', floor: '1st', bed_count: 2, status: 'vacant', expected_rent: 12000, actual_rent: 12000, last_confirmed_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'r2', property_id: 'p1', room_number: '102', floor: '1st', bed_count: 2, status: 'vacant', expected_rent: 12000, actual_rent: 12000, last_confirmed_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'r3', property_id: 'p2', room_number: '201', floor: '2nd', bed_count: 3, status: 'vacant', expected_rent: 9000, actual_rent: 9000, last_confirmed_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'r4', property_id: 'p2', room_number: '202', floor: '2nd', bed_count: 2, status: 'vacant', expected_rent: 10000, actual_rent: 10000, last_confirmed_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'r5', property_id: 'p3', room_number: '301', floor: '3rd', bed_count: 2, status: 'vacant', expected_rent: 11000, actual_rent: 11000, last_confirmed_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'r6', property_id: 'p3', room_number: '302', floor: '3rd', bed_count: 3, status: 'vacant', expected_rent: 10000, actual_rent: 10000, last_confirmed_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'r7', property_id: 'p4', room_number: '401', floor: '4th', bed_count: 2, status: 'vacant', expected_rent: 8500, actual_rent: 8500, last_confirmed_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'r8', property_id: 'p4', room_number: '402', floor: '4th', bed_count: 3, status: 'vacant', expected_rent: 9000, actual_rent: 9000, last_confirmed_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'r9', property_id: 'p5', room_number: '501', floor: '5th', bed_count: 2, status: 'vacant', expected_rent: 7500, actual_rent: 7500, last_confirmed_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'r10', property_id: 'p5', room_number: '502', floor: '5th', bed_count: 2, status: 'vacant', expected_rent: 8000, actual_rent: 8000, last_confirmed_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];

  await supabase.from('rooms').insert(rooms);

  // Create beds
  const beds: Bed[] = [];
  rooms.forEach((room, roomIndex) => {
    for (let i = 1; i <= room.bed_count; i++) {
      beds.push({
        id: `b${roomIndex * 10 + i}`,
        room_id: room.id,
        bed_number: `Bed ${i}`,
        status: 'vacant',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  });

  await supabase.from('beds').insert(beds);

  // Create leads
  const leads: Lead[] = [
    { id: 'l1', name: 'Aarav Patel', phone: '+91 9876543210', source: 'whatsapp', status: 'new', assigned_agent_id: 'a1', budget: '₹8,000-12,000', preferred_location: 'Koramangala', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_activity_at: new Date().toISOString() },
    { id: 'l2', name: 'Sneha Reddy', phone: '+91 8765432109', source: 'website', status: 'contacted', assigned_agent_id: 'a2', budget: '₹10,000-15,000', preferred_location: 'HSR Layout', first_response_time_min: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_activity_at: new Date().toISOString() },
    { id: 'l3', name: 'Karan Mehta', phone: '+91 7654321098', source: 'instagram', status: 'requirement_collected', assigned_agent_id: 'a3', budget: '₹7,000-10,000', preferred_location: 'BTM Layout', first_response_time_min: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_activity_at: new Date().toISOString() },
    { id: 'l4', name: 'Divya Nair', phone: '+91 6543210987', source: 'facebook', status: 'property_suggested', assigned_agent_id: 'a1', budget: '₹12,000-18,000', preferred_location: 'Indiranagar', first_response_time_min: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_activity_at: new Date().toISOString() },
    { id: 'l5', name: 'Rohit Kumar', phone: '+91 5432109876', source: 'phone', status: 'visit_scheduled', assigned_agent_id: 'a4', budget: '₹9,000-13,000', preferred_location: 'Marathahalli', first_response_time_min: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_activity_at: new Date().toISOString() },
    { id: 'l6', name: 'Meera Joshi', phone: '+91 4321098765', source: 'landing_page', status: 'visit_completed', assigned_agent_id: 'a3', budget: '₹11,000-16,000', preferred_location: 'Whitefield', first_response_time_min: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_activity_at: new Date().toISOString() },
    { id: 'l7', name: 'Arjun Kapoor', phone: '+91 3210987654', source: 'whatsapp', status: 'booked', assigned_agent_id: 'a2', budget: '₹10,000-14,000', preferred_location: 'Electronic City', first_response_time_min: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_activity_at: new Date().toISOString() },
    { id: 'l8', name: 'Pooja Gupta', phone: '+91 2109876543', source: 'website', status: 'lost', assigned_agent_id: 'a4', budget: '₹6,000-8,000', preferred_location: 'Yelahanka', first_response_time_min: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_activity_at: new Date().toISOString() },
    { id: 'l9', name: 'Nikhil Agarwal', phone: '+91 1098765432', source: 'whatsapp', status: 'new', assigned_agent_id: 'a3', budget: '₹8,500-12,000', preferred_location: 'JP Nagar', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_activity_at: new Date().toISOString() },
    { id: 'l10', name: 'Riya Chatterjee', phone: '+91 9871234567', source: 'instagram', status: 'contacted', assigned_agent_id: 'a1', budget: '₹9,000-11,000', preferred_location: 'Koramangala', first_response_time_min: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_activity_at: new Date().toISOString() },
    { id: 'l11', name: 'Amit Saxena', phone: '+91 8761234567', source: 'phone', status: 'new', assigned_agent_id: 'a2', budget: '₹7,500-10,000', preferred_location: 'HSR Layout', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_activity_at: new Date().toISOString() },
    { id: 'l12', name: 'Tanvi Shah', phone: '+91 7651234567', source: 'landing_page', status: 'requirement_collected', assigned_agent_id: 'a4', budget: '₹13,000-18,000', preferred_location: 'Indiranagar', first_response_time_min: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_activity_at: new Date().toISOString() },
    { id: 'l13', name: 'Suresh Iyer', phone: '+91 6541234567', source: 'website', status: 'visit_scheduled', assigned_agent_id: 'a3', budget: '₹10,000-15,000', preferred_location: 'Whitefield', first_response_time_min: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_activity_at: new Date().toISOString() },
    { id: 'l14', name: 'Kavita Rao', phone: '+91 5431234567', source: 'facebook', status: 'property_suggested', assigned_agent_id: 'a1', budget: '₹8,000-11,000', preferred_location: 'BTM Layout', first_response_time_min: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), last_activity_at: new Date().toISOString() },
  ];

  await supabase.from('leads').insert(leads);

  // Create visits
  const visits: Visit[] = [
    { id: 'v1', lead_id: 'l5', property_id: 'p2', scheduled_at: '2026-03-10T14:00:00+05:30', assigned_staff_id: 'a4', confirmed: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'v2', lead_id: 'l13', property_id: 'p3', scheduled_at: '2026-03-09T11:00:00+05:30', assigned_staff_id: 'a3', confirmed: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'v3', lead_id: 'l6', property_id: 'p3', scheduled_at: '2026-03-07T15:00:00+05:30', assigned_staff_id: 'a3', confirmed: true, outcome: 'considering', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'v4', lead_id: 'l4', property_id: 'p1', scheduled_at: '2026-03-11T10:00:00+05:30', assigned_staff_id: 'a1', confirmed: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];

  await supabase.from('visits').insert(visits);

  // Create conversations
  const conversations: Conversation[] = [
    { lead_id: 'l1', message: 'Hi, I am looking for a PG in Koramangala', direction: 'inbound', channel: 'whatsapp', created_at: new Date().toISOString() },
    { lead_id: 'l1', message: 'We have several options in Koramangala. Would you like to see some?', direction: 'outbound', channel: 'whatsapp', created_at: new Date().toISOString() },
    { lead_id: 'l2', message: 'Hello, I saw your website and want to know about HSR Layout properties', direction: 'inbound', channel: 'website', created_at: new Date().toISOString() },
    { lead_id: 'l3', message: 'Interested in BTM Layout PGs with budget ₹8000', direction: 'inbound', channel: 'instagram', created_at: new Date().toISOString() },
    { lead_id: 'l7', message: 'Confirmed booking for Electronic City!', direction: 'outbound', channel: 'whatsapp', created_at: new Date().toISOString() },
  ];

  await supabase.from('conversations').insert(conversations);

  // Create follow-up reminders
  const reminders: FollowUp[] = [
    { lead_id: 'l2', reminder_date: '2026-03-10T10:00:00+05:30', is_completed: false, created_at: new Date().toISOString() },
    { lead_id: 'l3', reminder_date: '2026-03-09T15:00:00+05:30', is_completed: false, created_at: new Date().toISOString() },
    { lead_id: 'l11', reminder_date: '2026-03-11T09:00:00+05:30', is_completed: false, created_at: new Date().toISOString() },
  ];

  await supabase.from('follow_up_reminders').insert(reminders);

  // Create bookings
  const bookings: Booking[] = [
    { id: 'b1', lead_id: 'l7', property_id: 'p5', room_id: 'r9', bed_id: 'b19', monthly_rent: 7500, move_in_date: '2026-03-15', booking_status: 'confirmed', payment_status: 'paid', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'b2', lead_id: 'l6', property_id: 'p3', room_id: 'r5', bed_id: 'b11', monthly_rent: 11000, move_in_date: '2026-03-20', booking_status: 'pending', payment_status: 'unpaid', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];

  await supabase.from('bookings').insert(bookings);

  // Create user roles
  const userRoles = [
    { user_id: 'a1', role: 'agent', is_active: true, created_at: new Date().toISOString() },
    { user_id: 'a2', role: 'agent', is_active: true, created_at: new Date().toISOString() },
    { user_id: 'a3', role: 'manager', is_active: true, created_at: new Date().toISOString() },
    { user_id: 'a4', role: 'agent', is_active: true, created_at: new Date().toISOString() },
  ];

  await supabase.from('user_roles').insert(userRoles);

  console.log('✅ Seed data created successfully!');
};