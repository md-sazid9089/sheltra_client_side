<?php

declare(strict_types=1);

/**
 * Aiven MySQL connection test using PDO + SSL.
 *
 * How to run:
 * 1) Download Aiven CA certificate from your Aiven service and save it locally.
 * 2) Update $sslCaPath or pass AIVEN_SSL_CA_PATH env var.
 * 3) Set AIVEN_DB_PASSWORD env var (recommended), or fill $password directly.
 * 4) Run: php scripts/aiven_mysql_pdo_test.php
 */

$host = 'mysql-3f596587-aust-b6bd.aivencloud.com';
$port = 21796;
$dbName = 'defaultdb';
$username = 'avnadmin';

// Recommended: set this in environment instead of hardcoding.
$password = getenv('AIVEN_DB_PASSWORD') ?: '';

// Path to Aiven CA certificate (.pem)
$sslCaPath = getenv('AIVEN_SSL_CA_PATH') ?: __DIR__ . DIRECTORY_SEPARATOR . 'aiven-ca.pem';

if ($password === '') {
    echo "Error: Missing database password. Set AIVEN_DB_PASSWORD environment variable." . PHP_EOL;
    exit(1);
}

if (!file_exists($sslCaPath)) {
    echo "Error: SSL CA certificate not found at: {$sslCaPath}" . PHP_EOL;
    echo "Download the CA cert from Aiven and set AIVEN_SSL_CA_PATH." . PHP_EOL;
    exit(1);
}

$dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $host, $port, $dbName);

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_TIMEOUT => 10,
    PDO::MYSQL_ATTR_SSL_CA => $sslCaPath,
    PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true,
];

$pdo = null;

try {
    $pdo = new PDO($dsn, $username, $password, $options);
    echo "Success: Connected to Aiven MySQL with SSL." . PHP_EOL;

    // Example query: replace table name/columns with your actual schema.
    $sql = 'SELECT * FROM users LIMIT 5';
    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll();

    echo "Example query ran successfully. Rows fetched: " . count($rows) . PHP_EOL;

    foreach ($rows as $index => $row) {
        echo 'Row ' . ($index + 1) . ': ' . json_encode($row, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    }
} catch (PDOException $e) {
    echo "Connection/Query failed: " . $e->getMessage() . PHP_EOL;
    exit(1);
} finally {
    // Close connection explicitly
    $pdo = null;
    echo "Connection closed." . PHP_EOL;
}
