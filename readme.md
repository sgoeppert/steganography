# Image Steganography

Takes a "carrier" image and embeds another image in it. This implementation combines the images pixel by pixel, color by color. It keeps the highest bytes from both images and combines them into a new byte. 

For example these two bytes

Image A: 11010010  
Image B: 01111011  

can be split into 1101 and 0111 by taking removing the lowest 4 bytes from image A and taking the highest 4 bytes from image B. They can then be combined into a new byte

Image C: 11010111

The number of bytes is variable, for example taking 6 bytes from image B leaves you with the parts 11 and 011110 which combine into

Image C: 11011110

