package com.owilka.hotel.service;

import com.owilka.hotel.model.Room;
import com.owilka.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    /**
     * Create a new room type
     */
    public Room createRoom(Room room) {
        // Set default values if not provided
        if (room.getOccupiedRooms() == null) {
            room.setOccupiedRooms(0);
        }
        if (room.getStatus() == null || room.getStatus().isEmpty()) {
            room.setStatus("active");
        }
        return roomRepository.save(room);
    }

    /**
     * Get all room types
     */
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    /**
     * Get room type by ID
     */
    public Optional<Room> getRoomById(String id) {
        return roomRepository.findById(id);
    }

    /**
     * Update an existing room type
     */
    public Room updateRoom(String id, Room roomDetails) {
        Optional<Room> roomData = roomRepository.findById(id);
        
        if (roomData.isPresent()) {
            Room existingRoom = roomData.get();
            
            // Update all fields
            if (roomDetails.getRoomTypeName() != null) {
                existingRoom.setRoomTypeName(roomDetails.getRoomTypeName());
            }
            if (roomDetails.getPricePerNight() != null) {
                existingRoom.setPricePerNight(roomDetails.getPricePerNight());
            }
            if (roomDetails.getTotalRooms() != null) {
                existingRoom.setTotalRooms(roomDetails.getTotalRooms());
            }
            if (roomDetails.getRoomSize() != null) {
                existingRoom.setRoomSize(roomDetails.getRoomSize());
            }
            if (roomDetails.getBedType() != null) {
                existingRoom.setBedType(roomDetails.getBedType());
            }
            if (roomDetails.getMaxOccupancy() != null) {
                existingRoom.setMaxOccupancy(roomDetails.getMaxOccupancy());
            }
            if (roomDetails.getViewType() != null) {
                existingRoom.setViewType(roomDetails.getViewType());
            }
            if (roomDetails.getFloorNumber() != null) {
                existingRoom.setFloorNumber(roomDetails.getFloorNumber());
            }
            if (roomDetails.getDescription() != null) {
                existingRoom.setDescription(roomDetails.getDescription());
            }
            if (roomDetails.getAmenities() != null) {
                existingRoom.setAmenities(roomDetails.getAmenities());
            }
            if (roomDetails.getImageUrl() != null) {
                existingRoom.setImageUrl(roomDetails.getImageUrl());
            }
            if (roomDetails.getStatus() != null) {
                existingRoom.setStatus(roomDetails.getStatus());
            }
            if (roomDetails.getOccupiedRooms() != null) {
                existingRoom.setOccupiedRooms(roomDetails.getOccupiedRooms());
            }
            
            return roomRepository.save(existingRoom);
        } else {
            return null;
        }
    }

    /**
     * Delete a room type
     */
    public boolean deleteRoom(String id) {
        try {
            if (roomRepository.existsById(id)) {
                roomRepository.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get rooms by status
     */
    public List<Room> getRoomsByStatus(String status) {
        return roomRepository.findByStatus(status);
    }

    /**
     * Search rooms by name (case-insensitive)
     */
    public List<Room> searchRoomsByName(String name) {
        return roomRepository.findByRoomTypeNameContainingIgnoreCase(name);
    }

    /**
     * Get available rooms (where occupiedRooms < totalRooms)
     */
    public List<Room> getAvailableRooms() {
        return roomRepository.findAll().stream()
            .filter(room -> room.getOccupiedRooms() < room.getTotalRooms())
            .toList();
    }

    /**
     * Update occupied rooms count
     */
    public Room updateOccupiedRooms(String id, Integer occupiedRooms) {
        Optional<Room> roomData = roomRepository.findById(id);
        
        if (roomData.isPresent()) {
            Room room = roomData.get();
            
            // Validate that occupied rooms doesn't exceed total rooms
            if (occupiedRooms <= room.getTotalRooms()) {
                room.setOccupiedRooms(occupiedRooms);
                return roomRepository.save(room);
            } else {
                throw new IllegalArgumentException("Occupied rooms cannot exceed total rooms");
            }
        } else {
            return null;
        }
    }
}
