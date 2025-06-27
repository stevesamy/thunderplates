# Thunderplates

Thunderplates is a simple Thunderbird add-on for composing emails from reusable templates.

## Features

- Define email templates in the add-on's settings page. Each template includes a name and HTML body text, with an optional subject. The body is edited using a simple WYSIWYG editor.
- Insert a template from the compose window using the "Insert template" button.
- Selecting a template inserts its body at the current cursor position and, if provided, replaces the draft's subject.
- Import templates from a Quicktext XML file on the options page.

## Installation

1. Open Thunderbird and go to **Add-ons and Themes**.
2. Choose **Install Add-on From File...** and select the `src/` directory as a packed extension (zip the contents if needed).
3. Once installed, open the add-on's **Preferences** to create templates.
4. Start a new message and use the **Insert template** button in the compose window to choose a template.

Thunderplates requires Thunderbird 139 or newer.
