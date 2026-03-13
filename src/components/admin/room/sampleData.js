// src/components/rooms/sampleData.js
export const sampleRoomTypes = [
  { id: "rt-1", name: "Deluxe", baseRate: 6850 },
  { id: "rt-2", name: "Suite", baseRate: 12500 },
  { id: "rt-3", name: "Standard", baseRate: 3500 },
];

export const sampleAmenities = [
  { id: "a-1", name: "WiFi" },
  { id: "a-2", name: "Mini-bar" },
  { id: "a-3", name: "Ocean View" },
  { id: "a-4", name: "Bathtub" },
];

export const sampleEmployees = [
  { id: "e-1", name: "Ramesh Kumar" },
  { id: "e-2", name: "Sonia Patel" },
  { id: "e-3", name: "Vikram Shah" },
];

export const sampleRooms = [
  {
    id: "room-101",
    roomNumber: "101",
    floor: "1",
    status: "AVAILABLE",
    description: "Sea-facing deluxe room",
    maxOccupancy: 2,
    roomTypeId: "rt-1",
    roomAmenities: [{ id: "a-1" }, { id: "a-2" }],
    roomBlocks: [],
    maintenanceRequests: [{ id: "mr-1", title: "AC not cooling", createdAt: "2025-02-25" }],
    housekeepingTasks: [{ id: "hk-1", staffId: "e-2", scheduledAt: "2025-03-05T09:00:00", priority: "HIGH", status: "SCHEDULED" }],
  },
  {
    id: "room-102",
    roomNumber: "102",
    floor: "1",
    status: "OCCUPIED",
    description: "Standard double",
    maxOccupancy: 2,
    roomTypeId: "rt-3",
    roomAmenities: [{ id: "a-1" }],
    roomBlocks: [],
    maintenanceRequests: [],
    housekeepingTasks: [],
  },
  {
    id: "room-201",
    roomNumber: "201",
    floor: "2",
    status: "MAINTENANCE",
    description: "Suite - under maintenance",
    maxOccupancy: 4,
    roomTypeId: "rt-2",
    roomAmenities: [{ id: "a-1" }, { id: "a-4" }],
    roomBlocks: [],
    maintenanceRequests: [{ id: "mr-2", title: "Carpet replacement", createdAt: "2025-02-20" }],
    housekeepingTasks: [],
  },
];