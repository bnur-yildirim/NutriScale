# NutriScale

NutriScale is a Bluetooth-enabled kitchen scale powered by an ESP32 microcontroller that dynamically adjusts recipe portions based on real-time weight data. The project combines hardware precision with a web-based interface for improved cooking accuracy and convenience.

## Video Demonstration
[Project Video Link - https://www.youtube.com/shorts/QHhpDsezP54]

## Features
- **Real-time Weight Measurement:** Displays ingredient weight directly on the web app.
- **Dynamic Recipe Scaling:** Automatically adjusts recipe portions based on the measured weight.
- **Ingredient Selection:** Users can choose specific ingredients for accurate scaling.
- **Recipe Storage:** Save customized recipes with user notes for future reference.
- **User Guidance:** Step-by-step instructions for precise cooking assistance.

## Hardware Components
- **ESP32 Microcontroller:** Enables Bluetooth connectivity for seamless data transmission.
- **Weight Sensor with HX711 Amplifier:** Ensures accurate weight readings.
- **Digital Display:** Provides clear, real-time weight information.
- **Enclosure:** Designed for stability, durability, and kitchen usability.

## Software Stack
- **Node.js Backend:** Manages data synchronization, recipe scaling logic, and Bluetooth communication.
- **Frontend Web App:** Built for desktop and mobile browsers with an intuitive UI.

## Getting Started

### Prerequisites
- Node.js and npm installed on your system
- ESP32 configured with your scale's hardware

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/bnur-yildirim/NutriScale.git
   cd NutriScale
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Upload the ESP32 firmware via Arduino IDE or PlatformIO with the correct Bluetooth configurations.

### Running the Project
1. Start the Node.js server:
   ```bash
   node server.js
   ```
2. Access the web app through your browser at `http://localhost:3000`.
3. Pair the scale with the web app via Bluetooth and start weighing ingredients.

## Usage Instructions
- Power on the ESP32 device.
- Connect the scale via the "Connect Scale" button in the web app.
- Select a recipe and place ingredients on the scale to see real-time portion adjustments.

## Contributors
- **Beyza & Buse:** Developed the software and hardware integration.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
