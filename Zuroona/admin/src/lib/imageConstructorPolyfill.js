/**
 * Image constructor polyfill for browser environments.
 *
 * Some code (e.g. Chart.js or other deps) may call the native Image constructor
 * as a function (Image()) instead of with the new operator (new Image()).
 * Browsers throw: "Failed to construct 'Image': Please use the 'new' operator".
 *
 * This runs only in the browser and makes Image() equivalent to new Image(),
 * so both forms work. Import this before any component that might trigger the call.
 */

if (typeof window !== 'undefined' && typeof window.Image === 'function') {
  const NativeImage = window.Image;
  function ImagePolyfill(width, height) {
    if (new.target === undefined) {
      return new NativeImage(width, height);
    }
    return Reflect.construct(NativeImage, [width, height], new.target);
  }
  ImagePolyfill.prototype = NativeImage.prototype;
  window.Image = ImagePolyfill;
}
