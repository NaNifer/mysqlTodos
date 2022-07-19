DROP DATABASE IF EXISTS todos_db;
CREATE DATABASE todos_db;

USE todos_db;

CREATE TABLE todos (
	id INT AUTO_INCREMENT,
    todo VARCHAR(255) NOT NULL,
    isComplete BOOLEAN DEFAULT 0,
    -- This is the primary column.
    -- We use to join data with other tables.
    -- This will automatically make it so that id has to be unique. 
    PRIMARY KEY (id)
);

