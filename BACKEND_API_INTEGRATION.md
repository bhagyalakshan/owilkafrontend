# Backend API Integration Guide

## Your Spring Boot Backend Setup

Your Next.js frontend is configured to connect to your **separate Spring Boot backend** running on `http://localhost:8080`.

## Required API Endpoints in Your Spring Boot Backend

Add these endpoints to your existing Spring Boot `RoomController`:

### 1. **Create Room** (Already implemented if form is working)
```java
@PostMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:3000")
public ResponseEntity<Room> createRoom(@RequestBody Room room) {
    Room savedRoom = roomService.createRoom(room);
    return new ResponseEntity<>(savedRoom, HttpStatus.CREATED);
}
```

### 2. **Get All Rooms** (Needed for displaying rooms list)
```java
@GetMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:3000")
public ResponseEntity<List<Room>> getAllRooms() {
    List<Room> rooms = roomService.getAllRooms();
    return new ResponseEntity<>(rooms, HttpStatus.OK);
}
```

### 3. **Update Room** (NEW - for edit functionality)
```java
@PutMapping("/api/rooms/{id}")
@CrossOrigin(origins = "http://localhost:3000")
public ResponseEntity<Room> updateRoom(@PathVariable("id") String id, @RequestBody Room room) {
    Room updatedRoom = roomService.updateRoom(id, room);
    if (updatedRoom != null) {
        return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
    }
    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
}
```

### 4. **Get Room by ID** (Optional - for future use)
```java
@GetMapping("/api/rooms/{id}")
@CrossOrigin(origins = "http://localhost:3000")
public ResponseEntity<Room> getRoomById(@PathVariable("id") String id) {
    Optional<Room> room = roomService.getRoomById(id);
    return room.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
               .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
}
```

### 5. **Delete Room** (Optional - for future delete functionality)
```java
@DeleteMapping("/api/rooms/{id}")
@CrossOrigin(origins = "http://localhost:3000")
public ResponseEntity<HttpStatus> deleteRoom(@PathVariable("id") String id) {
    boolean deleted = roomService.deleteRoom(id);
    return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT) 
                   : new ResponseEntity<>(HttpStatus.NOT_FOUND);
}
```

## Service Layer Methods Needed

Add these methods to your `RoomService` class:

```java
// Get all rooms
public List<Room> getAllRooms() {
    return roomRepository.findAll();
}

// Get room by ID
public Optional<Room> getRoomById(String id) {
    return roomRepository.findById(id);
}

// Update room
public Room updateRoom(String id, Room roomDetails) {
    Optional<Room> roomData = roomRepository.findById(id);
    
    if (roomData.isPresent()) {
        Room room = roomData.get();
        
        // Update fields
        room.setRoomTypeName(roomDetails.getRoomTypeName());
        room.setPricePerNight(roomDetails.getPricePerNight());
        room.setTotalRooms(roomDetails.getTotalRooms());
        room.setRoomSize(roomDetails.getRoomSize());
        room.setBedType(roomDetails.getBedType());
        room.setMaxOccupancy(roomDetails.getMaxOccupancy());
        room.setViewType(roomDetails.getViewType());
        room.setFloorNumber(roomDetails.getFloorNumber());
        room.setDescription(roomDetails.getDescription());
        room.setAmenities(roomDetails.getAmenities());
        room.setImageUrl(roomDetails.getImageUrl());
        room.setStatus(roomDetails.getStatus());
        
        return roomRepository.save(room);
    }
    
    return null;
}

// Delete room
public boolean deleteRoom(String id) {
    if (roomRepository.existsById(id)) {
        roomRepository.deleteById(id);
        return true;
    }
    return false;
}
```

## Room Entity/Model Requirements

Your `Room` entity should have these fields:

```java
@Document(collection = "rooms")
public class Room {
    @Id
    private String id;
    
    private String roomTypeName;      // Required
    private Double pricePerNight;     // Required
    private Integer totalRooms;       // Required
    private Integer occupiedRooms;    // Optional (default: 0)
    private String roomSize;          // Optional (e.g., "350 sq ft")
    private String bedType;           // Optional (single/double/queen/king)
    private Integer maxOccupancy;     // Optional
    private String viewType;          // Optional (e.g., "Ocean", "Garden")
    private Integer floorNumber;      // Optional
    private String description;       // Optional
    private List<String> amenities;   // Optional
    private String imageUrl;          // Optional
    private String status;            // Optional (active/inactive/maintenance)
    
    // Getters and setters...
}
```

## Frontend → Backend Flow

### 1. **Add New Room**
```
User fills form → Click "Add Room" 
→ POST http://localhost:8080/api/rooms
→ Success notification
→ Auto-refresh rooms list
```

### 2. **View Rooms**
```
User clicks "Rooms" tab
→ GET http://localhost:8080/api/rooms
→ Display all rooms with images
```

### 3. **Edit Room**
```
User clicks "Manage Room"
→ Edit modal opens with current data
→ User makes changes
→ PUT http://localhost:8080/api/rooms/{id}
→ Success notification
→ Auto-refresh rooms list
```

## API Configuration in Frontend

The frontend makes requests to your backend at:
- **Base URL**: `http://localhost:8080`
- **Endpoints**: 
  - POST `/api/rooms` - Create
  - GET `/api/rooms` - List all
  - PUT `/api/rooms/{id}` - Update
  - DELETE `/api/rooms/{id}` - Delete

## CORS Configuration

**Important**: Your Spring Boot backend MUST allow requests from `http://localhost:3000`.

Add to your Spring Boot configuration:

### Option 1: Per Controller (Recommended)
```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    // ... endpoints
}
```

### Option 2: Global Configuration
Create a config class:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```

## Testing Your Backend

Before using the frontend, test your backend endpoints:

### Using cURL:

**Create Room:**
```bash
curl -X POST http://localhost:8080/api/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "roomTypeName": "Test Suite",
    "pricePerNight": 199.99,
    "totalRooms": 5,
    "status": "active"
  }'
```

**Get All Rooms:**
```bash
curl http://localhost:8080/api/rooms
```

**Update Room:**
```bash
curl -X PUT http://localhost:8080/api/rooms/{YOUR_ROOM_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "roomTypeName": "Updated Suite",
    "pricePerNight": 249.99,
    "totalRooms": 5,
    "status": "active"
  }'
```

### Using Postman/Insomnia:
1. Import the endpoints above
2. Test each one before using frontend
3. Verify responses match expected format

## Troubleshooting

### Frontend can't connect to backend:

**Check 1**: Is Spring Boot running?
```bash
# Should be accessible
curl http://localhost:8080/api/rooms
```

**Check 2**: CORS enabled?
- Look for `@CrossOrigin` annotation
- Check browser console for CORS errors (F12)

**Check 3**: Correct port?
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`

### Images not showing:
- See `IMAGE_TROUBLESHOOTING.md`
- Restart Next.js dev server after config changes
- Use direct HTTPS image URLs

### Update not working:
- Verify PUT endpoint exists in your Spring Boot backend
- Check if Room ID is being sent correctly
- Look at Network tab (F12) to see request/response

## Quick Start Checklist

1. ✅ Spring Boot backend running on port 8080
2. ✅ MongoDB running and connected
3. ✅ CORS enabled for `http://localhost:3000`
4. ✅ All required endpoints implemented:
   - POST `/api/rooms`
   - GET `/api/rooms`
   - PUT `/api/rooms/{id}`
5. ✅ Next.js frontend running: `npm run dev`
6. ✅ Test: Add room via frontend form
7. ✅ Test: View rooms in Rooms tab
8. ✅ Test: Click "Manage Room" to edit

## Current Frontend Features

Your Next.js admin dashboard now has:
- ✅ Room creation form with all fields
- ✅ Display all rooms from database (not dummy data)
- ✅ Beautiful room cards with images
- ✅ Edit modal for updating room details
- ✅ Custom notification overlays
- ✅ Loading animations
- ✅ Mobile responsive design
- ✅ Image fallback for broken/missing images

## Need to Add to Your Spring Boot Backend

If you haven't already, add these to your existing Spring Boot project:
1. **RoomController** - with GET and PUT endpoints
2. **RoomService** - with updateRoom() method  
3. **CORS configuration** - to allow frontend requests
4. **Room model** - with all required fields

That's it! The frontend is ready, just ensure your Spring Boot backend has these endpoints.
