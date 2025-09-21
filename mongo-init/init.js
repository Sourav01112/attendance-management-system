db = db.getSiblingDB('attendance_db');

db.users.insertMany([
  {
    email: "employee@test.com",
    password: "$2a$10$TyqJ4lbQ4lE5c0vAlxy.KeYau/apQoTH2q9HBBVks3Cl2LIrL4whe",
    name: "Sourav",
    role: "employee",
    created_at: new Date()
  },
  {
    email: "admin@test.com", 
    password: "$2a$10$Yo.o5RX9U/LxCXRt1NoXwuWR68gOreBnunx.gM6rzc5GYB0jVR5S6",
    name: "Admin",
    role: "admin",
    created_at: new Date()
  }
]);

print('=== USERS INSERTED ===');

db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });

print('=== INDEXES CREATED ===');