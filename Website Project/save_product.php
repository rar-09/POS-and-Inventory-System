<?php
// Assuming you have a MySQL database set up
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mydb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// File upload directory
$uploadDir = "uploads/"; // Directory where uploaded images will be stored
$uploadFile = $uploadDir . basename($_FILES['image']['name']);

// Move uploaded file to designated directory
if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
    // Prepare statement to insert data into the database
    $stmt = $conn->prepare("INSERT INTO products (productName, price, quantity, image) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sdis", $_POST['productName'], $_POST['price'], $_POST['quantity'], $uploadFile);

    // Execute statement
    if ($stmt->execute()) {
        header("Location: mainpage.html");
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Error uploading file.";
}

$conn->close();
?>
