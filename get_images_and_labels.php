<?php
$imageDir = 'C:/Users/dungn/OneDrive/Documents/GitHub/toupi.github.io/images/newProducts/';

$labelFile = 'C:/Users/dungn/OneDrive/Documents/GitHub/toupi.github.io/images/newProducts/text.txt';

$imageFiles = glob($imageDir . '*.png');
natsort($imageFiles); 
$labels = file($labelFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

$webImages = array_map(function($image) use ($imageDir) {
    return str_replace($imageDir, 'images/newProducts/', $image);
}, $imageFiles);

header('Content-Type: application/json');
echo json_encode(['images' => $webImages, 'labels' => $labels]);
