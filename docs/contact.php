<?php
/**
 * Hostinger-ready inquiry handler.
 * Upload this file next to your HTML. Create the mailbox inquiries@your-domain
 * in hPanel → Emails, or change $to below.
 */
header('Content-Type: application/json; charset=utf-8');

$to = 'inquiries@stratmeyeranalytica.org';
$allowed = ['POST'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'POST only']);
    exit;
}

function field($key) {
    return trim((string)($_POST[$key] ?? ''));
}

$name = field('name');
$email = field('email');
$org = field('org');
$scope = field('scope');
$conflict = field('conflict');
$message = field('message');

if ($name === '' || $email === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Name, valid email, and brief are required.']);
    exit;
}

$subject = 'Engagement inquiry — ' . substr($scope !== '' ? $scope : 'general', 0, 80);
$body = "Name: $name\nOrganization: $org\nEmail: $email\nScope: $scope\nConflict: $conflict\n\n$message\n";
$headers = [
    'From: ' . $to,
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));
if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Mail was not accepted by the host. Check Hostinger email routing.']);
    exit;
}

echo json_encode(['ok' => true]);
