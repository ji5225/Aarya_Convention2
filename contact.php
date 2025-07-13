<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

// Configuration
$to_email = "mr.jeai5225@gmail.com";
$subject = "Contact Form Submission - Aarya Convention";

// Get form data
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (!isset($data['name']) || !isset($data['email']) || !isset($data['phone']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

try {
    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'mr.jeai5225@gmail.com'; // Your Gmail address
    $mail->Password = 'your_app_password'; // Your Gmail App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Recipients
    $mail->setFrom($data['email'], $data['name']);
    $mail->addAddress($to_email);

    // Content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = "<h3>Contact Form Submission</h3>
                  <p><strong>Name:</strong> " . htmlspecialchars($data['name']) . "</p>
                  <p><strong>Email:</strong> " . htmlspecialchars($data['email']) . "</p>
                  <p><strong>Phone:</strong> " . htmlspecialchars($data['phone']) . "</p>
                  <p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($data['message'])) . "</p>";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo]);
}
?>
