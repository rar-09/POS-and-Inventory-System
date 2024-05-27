<?php
// Establish a connection to your database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mydb";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Execute query to fetch products
$sql = "SELECT * FROM products";
$result = $conn->query($sql);

// Check if any rows were returned
if ($result->num_rows > 0) {
    // Array to hold products
    $products = array();

    // Fetch rows and add them to the products array
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    // Convert the array of products to JSON and output it
    header('Content-Type: application/json');
    echo json_encode($products);
} else {
    echo "No products found";
}

// Close the connection
$conn->close();
?>