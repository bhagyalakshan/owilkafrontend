package com.owilka.hotel.repository;

import com.owilka.hotel.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {
    
    /**
     * Find rooms by status
     */
    List<Room> findByStatus(String status);
    
    /**
     * Find rooms by room type name (case-insensitive search)
     */
    List<Room> findByRoomTypeNameContainingIgnoreCase(String roomTypeName);
    
    /**
     * Find rooms by bed type
     */
    List<Room> findByBedType(String bedType);
    
    /**
     * Find rooms by floor number
     */
    List<Room> findByFloorNumber(Integer floorNumber);
    
    /**
     * Find rooms with price less than or equal to specified amount
     */
    List<Room> findByPricePerNightLessThanEqual(Double price);
    
    /**
     * Find rooms with price between min and max
     */
    List<Room> findByPricePerNightBetween(Double minPrice, Double maxPrice);
}
