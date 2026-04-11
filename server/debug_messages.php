<?php
// Debug script to check messages and users
$mysqli = new mysqli('db', 'sheltra', 'secret', 'sheltra_db');
if ($mysqli->connect_error) die('Connection failed: ' . $mysqli->connect_error);

echo "Messages in database:\n";
$sql = 'SELECT m.id, m.user_id, m.message, m.created_at, u.name, u.role FROM messages m LEFT JOIN users u ON m.user_id = u.id ORDER BY m.id DESC LIMIT 10';
$result = $mysqli->query($sql);

while ($row = $result->fetch_assoc()) {
    echo 'Message ID: ' . $row['id'] . ', User ID: ' . $row['user_id'] . ', User Name: ' . ($row['name'] ?: 'NULL') . ', Message: "' . substr($row['message'], 0, 30) . '..."\n';
}

echo "\n\nUsers in database:\n";
$sql = 'SELECT id, name, email, role FROM users LIMIT 10';
$result = $mysqli->query($sql);

while ($row = $result->fetch_assoc()) {
    echo 'User ID: ' . $row['id'] . ', Name: ' . $row['name'] . ', Email: ' . $row['email'] . ', Role: ' . $row['role'] . '\n';
}

$mysqli->close();
