import { Pool } from "pg";
import { config } from ".";

export const pool = new Pool({
  connectionString: config.connection_str,
});

export const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(250) UNIQUE NOT NULL CHECK(email = lower(email)),
        password TEXT NOT NULL CHECK(char_length(password) >= 6)
        phone TEXT NOT NULL,
        role VARCHAR(50) NOT NULL CHECK(role IN ('admin', 'customer'))
        )
        `);
  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(200) NOT NULL,
        type TEXT NOT NULL CHECK(type IN('car', 'bike', 'van','SUV')),
        registration_number TEXT UNIQUE NOT NULL,
        daily_rent_price INT NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(50) NOT NULL CHECK(availability_status IN ('available', 'booked'))
        )
        `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES users(id),
        vehicle_id INT NOT NULL REFERENCES vehicles(id),
        rent_start_date TIMESTAMP DEFAULT NOW() NOT NULL ,
        rent_end_date TIMESTAMP DEFAULT NOW() NOT NULL CHECK(rent_end_date > rent_start_date),
        total_price INT NOT NULL CHECK(total_price > 0),
        status VARCHAR(50) NOT NULL CHECK(status IN ('active', 'cancelled' , 'returned'))
        
        )
        `);
};
