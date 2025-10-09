# Extension Icons

This folder contains the icon files for the Accessibility Checker Chrome extension.

## Icon Files

- **icon16.png** - 16x16 pixels - Used in the extension management page
- **icon48.png** - 48x48 pixels - Used in the extension management page and toolbar
- **icon128.png** - 128x128 pixels - Used in the Chrome Web Store and installation

## Creating Custom Icons

If you want to create custom icons to replace the default ones:

1. Open `../icon-generator.html` in your web browser
2. Download each icon size by clicking the "Download" button
3. Save the files in this folder, replacing the existing icons
4. Reload the extension in `chrome://extensions/`

## Icon Requirements

- **Format**: PNG with transparency
- **Background**: Can be solid color or transparent
- **Content**: Should be recognizable at small sizes
- **Sizes**: Must provide all three sizes (16, 48, 128)

## Design Guidelines

For best results:

- Use simple, bold shapes
- Ensure good contrast
- Avoid fine details (especially for 16px)
- Test at actual size before finalizing
- Keep consistent design across all sizes

## Current Design

The default icons feature:

- Blue background (#4285f4)
- White "A11Y" text (accessibility shorthand) on larger icons
- White checkmark on the 16px icon
- Simple, recognizable design
