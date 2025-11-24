# Owilka Hotel Management - Backend Setup Guide

## Overview
This backend provides REST API endpoints for managing hotel room types in the Owilka Hotel Management System using Spring Boot and MongoDB.

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- MongoDB 4.4+
- Spring Boot 3.x

## Dependencies Required

Add these dependencies to your `pom.xml`:

```xml
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Boot Data MongoDB -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb</artifactId>
    </dependency>
    
    <!-- Lombok (for reducing boilerplate code) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Spring Boot DevTools (optional, for development) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
</dependencies>
```

## MongoDB Configuration

Add these properties to your `application.properties`:

```properties
# Server Configuration
server.port=8080

# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/owilka_hotel
spring.data.mongodb.database=owilka_hotel

# Alternative configuration (if using separate properties)
# spring.data.mongodb.host=localhost
# spring.data.mongodb.port=27017
# spring.data.mongodb.database=owilka_hotel

# Application Name
spring.application.name=owilka-hotel-backend

# Enable CORS
spring.web.cors.allowed-origins=http://localhost:3000
```

## Project Structure

```
src/main/java/com/owilka/hotel/
├── controller/
│   └── RoomController.java       # REST API endpoints
├── service/
│   └── RoomService.java          # Business logic
├── repository/
│   └── RoomRepository.java       # MongoDB data access
├── model/
│   └── Room.java                 # Room entity model
└── HotelApplication.java         # Main application class
```

## API Endpoints

### 1. Create Room Type
**POST** `/api/rooms`

Request Body:
```json
{
  "roomTypeName": "Deluxe Suite",
  "pricePerNight": 299.99,
  "totalRooms": 10,
  "roomSize": "450 sq ft",
  "bedType": "king",
  "maxOccupancy": 3,
  "viewType": "Ocean",
  "floorNumber": 5,
  "description": "Luxurious suite with ocean view",
  "amenities": ["WiFi", "TV", "Air Conditioning", "Mini Bar"],
  "imageUrl": "https://example.com/deluxe-suite.jpg",
  "status": "active"
}
```

### 2. Get All Rooms
**GET** `/api/rooms`

Response: Array of room objects

### 3. Get Room by ID
**GET** `/api/rooms/{id}`

Response: Single room object

### 4. Update Room
**PUT** `/api/rooms/{id}`

Request Body: Same as Create (only include fields to update)

### 5. Delete Room
**DELETE** `/api/rooms/{id}`

Response: 204 No Content

### 6. Get Rooms by Status
**GET** `/api/rooms/status/{status}`

Example: `/api/rooms/status/active`

### 7. Search Rooms by Name
**GET** `/api/rooms/search?name={searchTerm}`

Example: `/api/rooms/search?name=suite`

## Room Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | String | Auto-generated | MongoDB ObjectId |
| roomTypeName | String | Yes | Name of the room type |
| pricePerNight | Double | Yes | Price per night in dollars |
| totalRooms | Integer | Yes | Total number of rooms of this type |
| occupiedRooms | Integer | No | Number of occupied rooms (default: 0) |
| roomSize | String | No | Room size (e.g., "350 sq ft") |
| bedType | String | No | Type of bed (single, double, queen, king) |
| maxOccupancy | Integer | No | Maximum number of guests |
| viewType | String | No | View type (e.g., Ocean, Garden) |
| floorNumber | Integer | No | Floor number |
| description | String | No | Room description |
| amenities | List<String> | No | List of amenities |
| imageUrl | String | No | URL to room image |
| status | String | No | Room status (active, inactive, maintenance) |

## Running the Application

1. **Start MongoDB**:
   ```bash
   mongod
   ```

2. **Run Spring Boot Application**:
   ```bash
   mvn spring-boot:run
   ```

3. **Access the API**:
   - Base URL: `http://localhost:8080`
   - Test endpoint: `http://localhost:8080/api/rooms`

## Testing with cURL

### Create a Room:
```bash
curl -X POST http://localhost:8080/api/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "roomTypeName": "Deluxe Suite",
    "pricePerNight": 299.99,
    "totalRooms": 10,
    "status": "active"
  }'
```

### Get All Rooms:
```bash
curl http://localhost:8080/api/rooms
```

### Update a Room:
```bash
curl -X PUT http://localhost:8080/api/rooms/{roomId} \
  -H "Content-Type: application/json" \
  -d '{
    "pricePerNight": 349.99,
    "status": "active"
  }'
```

### Delete a Room:
```bash
curl -X DELETE http://localhost:8080/api/rooms/{roomId}
```

## MongoDB Queries (for manual testing)

```javascript
// Connect to MongoDB
use owilka_hotel

// View all rooms
db.rooms.find().pretty()

// Find active rooms
db.rooms.find({ status: "active" })

// Find rooms by price range
db.rooms.find({ pricePerNight: { $gte: 100, $lte: 300 } })

// Update a room
db.rooms.updateOne(
  { _id: ObjectId("your-room-id") },
  { $set: { pricePerNight: 350 } }
)

// Delete a room
db.rooms.deleteOne({ _id: ObjectId("your-room-id") })
```

## CORS Configuration

The controller includes `@CrossOrigin(origins = "http://localhost:3000")` to allow requests from the Next.js frontend.

For production, update this to your actual frontend domain:
```java
@CrossOrigin(origins = "https://yourdomain.com")
```

## Error Handling

The API returns standard HTTP status codes:
- `200 OK` - Successful GET/PUT request
- `201 Created` - Successful POST request
- `204 No Content` - Successful DELETE or empty result
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Frontend Integration

The Next.js admin dashboard is configured to:
1. Fetch rooms on "Rooms" tab load
2. Display rooms with images and details
3. Open edit modal when "Manage Room" is clicked
4. Update room via PUT request
5. Refresh list after successful update

Make sure the backend is running on `http://localhost:8080` before using the frontend.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `application.properties`
- Verify port 27017 is not blocked

### CORS Errors
- Verify `@CrossOrigin` annotation in controller
- Check frontend URL matches the allowed origin
- Clear browser cache

### Port Already in Use
- Change port in `application.properties`: `server.port=8081`
- Update frontend API calls to use new port

## Next Steps

1. Add authentication/authorization
2. Implement room booking functionality
3. Add image upload capability
4. Create admin user management
5. Add analytics and reporting
6. Implement rate limiting

## Support

For issues or questions, please refer to the main project documentation.
