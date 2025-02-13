# Love Story

This project is an interactive web application that tells a romantic story through a series of engaging stages. It combines heart-healing interactions, a memory matching game, a jigsaw puzzle, branching choices, and a final certificate that you can capture as a screenshot.

## Features

- **Heart Healing Stage:**  
  Click on a beautifully designed heart to heal it. Each click increases a "blood level" and triggers a beat animation. Once fully healed, the heart stops decaying and the background transitions from dark to vibrant.

- **Memory Matching Game:**  
  After healing the heart, players are presented with a memory matching game featuring love-themed emojis. Matching all pairs moves the story to the next stage.

- **Jigsaw Puzzle:**  
  Complete a draggable jigsaw puzzle created from a random love-themed image fetched from the Unsplash API (with a local image fallback).

- **"Do you love me?" Branching:**  
  A branching choice prompts the user with a "Do you love me?" question using custom modal popups instead of native alerts. A negative response triggers a 24-hour lockout.

- **Love Quotes Slideshow:**  
  If the user answers "Yes", a sequence of love quotes is displayed in a slideshow format.

- **Promise Form & Final Certificate:**  
  After the quotes, the user enters names and a promise/vow. A final certificate is then generated featuring:

  - Scattered love quotes on “pieces of paper” with a soft, paper-like design.
  - A central block displaying the names (in a romantic handwritten font) and the promise.
  - A "Take Screenshot" button powered by html2canvas.

- **Final View:**  
  A concluding view shows a message confirming that the two are meant for each other.

## Technologies Used

- **HTML5, CSS3, and JavaScript** for structure, styling, and interactivity.
- **CSS Animations and Transitions** for a dynamic user experience.
- **html2canvas** for capturing the certificate as an image.
- **Unsplash API** for fetching random love-themed images.
- **Google Fonts** ("Great Vibes", "Dancing Script", and "Open Sans") for a romantic and legible design.

## Setup and Usage

1. **Clone or Download the Repository:**  
   Download or clone the project to your local machine.

2. **Configure Assets:**

   - Ensure that your Unsplash public Access Key is set in `js/script.js` (the secret key must remain confidential).
   - Place your fallback image (e.g., `love-image.jpg`) in an `images/` folder if needed.
   - Add your audio files to an `audio/` folder if you wish to customize sound effects.

3. **Run the Application:**  
   Open `index.html` in a web browser to start the interactive experience.

4. **Interact:**
   - Click the heart to heal it (watch it beat on each click).
   - Complete the memory matching game.
   - Solve the jigsaw puzzle.
   - Respond to the "Do you love me?" prompt using custom modal popups.
   - Watch the love quotes slideshow.
   - Fill out the promise form to generate your final certificate.
   - Click the "Take Screenshot" button to capture and download your certificate.

## Customization

- **Design:**  
  You can modify the certificate styling in `css/style.css` to adjust colors, borders, shadows, and fonts.
- **Sound Effects:**  
  Replace the audio files in the `audio/` directory with your own files.
- **Images:**  
  Update the Unsplash API query or fallback image path as needed.

## Credits

- **Unsplash API:** Provides random love-themed images.
- **html2canvas:** Used for screenshot functionality.
- **Google Fonts:** For beautiful, romantic typography.

## License

This project is licensed under the MIT License.
