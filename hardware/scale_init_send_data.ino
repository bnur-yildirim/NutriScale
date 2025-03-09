#include <BluetoothSerial.h>
#include "HX711.h"
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// Pin definitions for the scale
#define DOUT  23
#define CLK   19

// OLED display setup
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

HX711 scale(DOUT, CLK);
BluetoothSerial SerialBT;

float weight;
float calibration_factor = 354320; // Adjust this value for accurate readings
String device_name = "ESP32_Scale"; // Bluetooth device name

void setup() {
  // Set up serial monitor
  Serial.begin(115200);
  Serial.println("HX711 calibration sketch");
  Serial.println("Remove all weight from scale");
  Serial.println("After readings begin, place known weight on scale");
  Serial.println("Press + or a to increase calibration factor");
  Serial.println("Press - or z to decrease calibration factor");

  // Start Bluetooth
  SerialBT.begin(device_name);  // Bluetooth device name
  Serial.printf("The device with name \"%s\" is started.\nNow you can pair it with Bluetooth!\n", device_name.c_str());

  // Initialize the scale
  scale.set_scale();
  scale.tare(); // Reset the scale to 0
  long zero_factor = scale.read_average(); // Get a baseline reading
  Serial.print("Zero factor: ");
  Serial.println(zero_factor);

  // Initialize the OLED display
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Address 0x3C for most OLEDs
    Serial.println("SSD1306 allocation failed");
    for (;;);
  }
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("Initializing...");
  display.display();
  delay(2000);
  display.clearDisplay();
}

void loop() {
  // Check if the Bluetooth client is connected
  if (SerialBT.hasClient()) {
    // Measure weight
    measureWeight();
    
    // Send weight in grams over Bluetooth
    String weightMessage = String(weight * 1000, 2) + " g\n";
    SerialBT.print(weightMessage); // Send weight over Bluetooth
    
    // Print the weight in grams to the serial monitor for debugging
    Serial.print("Grams: ");
    Serial.print(weight * 1000);
    Serial.println(" g");
  } else {
    // If no Bluetooth device is connected, print this message
    Serial.println("Waiting for Bluetooth connection...");
  }

  // Update OLED display with grams
  updateDisplay();

  delay(500); // Short delay for smooth operation
}

void measureWeight() {
  scale.set_scale(calibration_factor); // Set calibration factor for scale
  weight = scale.get_units(5); // Get weight in kilograms

  // If the weight is negative, reset to 0
  if (weight < 0) {
    weight = 0.00;
  }
}

void updateDisplay() {
  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(0, 0); // Column, Row
  display.print("Weight:");
  display.setCursor(0, 30);
  display.setTextSize(3);
  display.print(weight * 1000, 2); // Convert to grams
  display.setCursor(110, 30); // "g" biraz daha sağa kaydırıldı
  display.setTextSize(2);
  display.print("g");
  display.display();
}
