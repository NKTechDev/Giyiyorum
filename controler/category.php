<?php
// Database connection settings
$host = 'localhost';
$username = 'root';  // Replace with your MySQL username
$password = '';      // Replace with your MySQL password
$dbname = 'your_database_name';  // Replace with your database name

// Create a connection to the database
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch categories with their content
$sql = "
    SELECT categories.id AS category_id, categories.name AS category_name, 
           content.id AS content_id, content.title, content.body
    FROM categories
    LEFT JOIN content ON categories.id = content.category_id
    ORDER BY categories.name, content.title
";

// Execute the query and get the result
$result = $conn->query($sql);

// Check if there are any results
if ($result->num_rows > 0) {
    // Initialize an array to hold the categories and their content
    $categories = [];
    
    while ($row = $result->fetch_assoc()) {
        $category_id = $row['category_id'];
        
        // If the category does not exist in the array, add it
        if (!isset($categories[$category_id])) {
            $categories[$category_id] = [
                'name' => $row['category_name'],
                'content' => []
            ];
        }
        
        // Add the content to the category's 'content' array
        if ($row['content_id']) {
            $categories[$category_id]['content'][] = [
                'id' => $row['content_id'],
                'title' => $row['title'],
                'body' => $row['body']
            ];
        }
    }
    
    // Now you can output the categories and their content
    foreach ($categories as $category) {
        echo "<h2>" . htmlspecialchars($category['name']) . "</h2>";
        
        if (count($category['content']) > 0) {
            foreach ($category['content'] as $content) {
                echo "<div><h3>" . htmlspecialchars($content['title']) . "</h3>";
                echo "<p>" . htmlspecialchars($content['body']) . "</p></div>";
            }
        } else {
            echo "<p>No content available for this category.</p>";
        }
    }
} else {
    echo "No categories or content found.";
}

// Close the database connection
$conn->close();
?>
