# Wifi share

<p align="center">
  <img alt="Wifi Share's Logo" width="128" height="128" src="https://raw.githubusercontent.com/Pranav2612000/wifi_share/main/www/public/logoStoreIcon.png">
</p>

Want to share a short piece of snippet to another device on the network without needing to open email, whatsapp or any other third party tool? With Wifishare, you can. No need to login into or install any 3rd party software.Just go to [Wifi share](https://quick-wifi-share.web.app/) or install the extension and you're done.

## Screenshots
<img alt="Wifi Share's Screenshot 1" width="350" height="500" src="https://raw.githubusercontent.com/Pranav2612000/wifi_share/main/www/public/screenshot1.png">

## Usage
- Install the extension from the Chrome Extension Store or go to https://quick-wifi-share.web.app/
- In the textare, type in the text you wish to share with the other device
- On the other device, open the extension or visit the [website](https://quick-wifi-share.web.app/), you should see the text in the text area

- Note: If you don't see the message, ensure that both the devices are on the same network.

## How does it work?
- Wifi share uses websockets to transfer the messages between peers.
- Every time a new client (web or extension) joins, it joins the room matching it's IP Address. If such a room doesn't exist a new room is created.
- This client is then subscribed to this room and gets all updates made by other clients in this room.
- It can also send out its changes to which the other peers can listen to.

Note: Work on a better algorithm which uses peer to peer communication for transmitting the data is in progress. This would ensure that the actual data does not leave the network.

## Contribute
Create a fork and clone it. Run `npm install` to install the required dependencies.
To start the website in development mode, run `npm run dev`
To develop the extension, run `npm run dev-extension`. This will generate the extension build in `www/build` folder load it into chrome to test out the extension.

## Maintainer
- Pranav Joglekar

## License
This project is licensed under the terms of the MIT open source license. Please refer to LICENSE.md for the full terms.
