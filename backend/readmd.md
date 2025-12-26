# API

## Users (Auth + Profiles)
### Register User
POST http://localhost:9000/users/Register
#### Body:

{
    "Name": "Ahmad Ali",
    "Email": "ahmad.ali@example.com",
    "Password": "Password123",
    "Role": "guest",
    "Phone": "03001234567",
    "Address": "Karachi, Pakistan"
}

### Login User
POST http://localhost:9000/users/Login

Body:

{
    "Email": "ahmad.ali@example.com",
    "Password": "Password123"
}

1.3 Get All Users
GET http://localhost:9000/users

2️⃣ Rooms
2.1 Create Room
POST http://localhost:9000/rooms/create


Body:

{
    "RoomNumber": "101",
    "Type": "Deluxe",
    "Price": 5000,
    "Capacity": 2,
    "Amenities": ["AC", "TV", "WiFi", "Mini Fridge"],
    "Floor": 1,
    "Status": "available"
}

2.2 Get All Rooms
GET http://localhost:9000/rooms

2.3 Update Room
PUT http://localhost:9000/rooms/:id


Body:

{
    "Status": "occupied"
}

2.4 Delete Room
DELETE http://localhost:9000/rooms/:id

3️⃣ Bookings
3.1 Create Booking
POST http://localhost:9000/bookings/create


Body:

{
    "GuestId": "REPLACE_WITH_USER_ID",
    "RoomId": "REPLACE_WITH_ROOM_ID",
    "CheckInDate": "2025-12-26",
    "CheckOutDate": "2025-12-30",
    "Status": "reserved"
}

3.2 Get All Bookings
GET http://localhost:9000/bookings

3.3 Update Booking
PUT http://localhost:9000/bookings/:id


Body:

{
    "Status": "checked-in",
    "ActualCheckIn": "2025-12-26T14:00:00"
}

4️⃣ Invoices
4.1 Create Invoice
POST http://localhost:9000/invoices/create


Body:

{
    "BookingId": "REPLACE_WITH_BOOKING_ID",
    "GuestId": "REPLACE_WITH_USER_ID",
    "Items": [
        {"Description": "Room Charge", "Amount": 20000},
        {"Description": "Breakfast", "Amount": 2000},
        {"Description": "Laundry", "Amount": 1000}
    ],
    "Tax": 1500,
    "Discount": 500,
    "TotalAmount": 22700,
    "PaymentStatus": "pending"
}

4.2 Get All Invoices
GET http://localhost:9000/invoices

4.3 Update Invoice Payment Status
PUT http://localhost:9000/invoices/:id


Body:

{
    "PaymentStatus": "paid"
}

5️⃣ Payments
5.1 Add Payment
POST http://localhost:9000/payments/create


Body:

{
    "InvoiceId": "REPLACE_WITH_INVOICE_ID",
    "Amount": 22700,
    "Method": "card",
    "PaymentDate": "2025-12-26T15:00:00"
}

5.2 Get All Payments
GET http://localhost:9000/payments

6️⃣ Tasks (Housekeeping / Maintenance)
6.1 Create Task
POST http://localhost:9000/tasks/create


Body:

{
    "RoomId": "REPLACE_WITH_ROOM_ID",
    "ReportedBy": "REPLACE_WITH_USER_ID",
    "AssignedTo": "REPLACE_WITH_USER_ID",
    "Type": "housekeeping",
    "Description": "Clean room and change linens",
    "Status": "pending"
}

6.2 Get Tasks
GET http://localhost:9000/tasks

6.3 Update Task
PUT http://localhost:9000/tasks/:id


Body:

{
    "Status": "completed"
}

7️⃣ Service Requests
7.1 Create Service Request
POST http://localhost:9000/services/create


Body:

{
    "GuestId": "REPLACE_WITH_USER_ID",
    "BookingId": "REPLACE_WITH_BOOKING_ID",
    "ServiceType": "Room Service",
    "Details": "Request extra water bottles and snacks",
    "Status": "requested"
}

7.2 Get Service Requests
GET http://localhost:9000/services

7.3 Update Service Request
PUT http://localhost:9000/services/:id


Body:

{
    "Status": "completed"
}

8️⃣ System Settings
8.1 Get System Settings
GET http://localhost:9000/system

8.2 Update System Settings
POST http://localhost:9000/system/update


Body:

{
    "Taxes": 5,
    "Policies": "Check-in 2 PM, Check-out 12 PM",
    "Notifications": [
        {
            "UserId": "REPLACE_WITH_USER_ID",
            "Message": "Room 101 requires maintenance",
            "IsRead": false
        }
    ]
}