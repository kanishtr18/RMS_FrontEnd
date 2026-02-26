# 🏝️ Resort Management System (RMS) – Frontend

A modern React-based frontend for the Resort Management System (RMS).

This project is built using:

- ⚛️ React (Vite)
- 🎨 Tailwind CSS v4
- 📦 Axios (for future API integration)
- 🧱 Component-based architecture
- 🖥️ Role-based UI (Guest, Employee, Admin)

---

# 📌 Project Overview

The RMS Frontend provides a real-time web interface for managing resort operations including:

- Room management
- Booking management
- Food & Beverage operations
- Events handling
- Employee task management
- Reports and analytics
- Inventory tracking
- Support and feedback

This frontend connects to the Spring Boot backend of the Resort Management System.

---

# 🚀 Tech Stack

| Technology | Purpose |
|------------|----------|
| React (Vite) | UI Framework |
| Tailwind CSS v4 | Styling |
| JavaScript | Core language |
| Axios | API communication (future phase) |

---


# 📂 Project Structure
```
RMS_Frontend/
│
├───public
│    ├───vite.svg
│
└───src
│   ├───App.jsx
|   ├───main.jsx
│   │
│   ├───assets
│   │   ├───react.svg
│   │
│   ├───components
│   │   ├───admin/
│   │   ├───auth/
│   │   ├───common/
│   │   ├───employee/
│   │   ├───events/
│   │   ├───guest/
│   │   ├───layout/
│   │   └───ui/
│   ├───layouts
│   ├───pages
│   │   ├───admin/
│   │   ├───auth/
│   │   ├───employee/
│   │   ├───guest/
│   │   ├───misc/
│   │   ├───reports/
│   │   └───shared/
│   ├───styles
│   │    ├───globals.css
│   │    ├───tailwind.css
│   │
│   └───utils
│
└── README.md
```

# 🏨 Luxury Resort – Modern UI (Tailwind CSS v4)

A sophisticated, high-performance UI kit designed for luxury resort management. This project focuses on a clean, modern aesthetic with a "CSS-first" approach using Tailwind CSS v4.

---

## 🎨 Design Theme & Identity

Our design philosophy centers on elegance, relaxation, and intuitive navigation.

### Color Palette
| Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Ocean Blue** | `#22b9e7` | Primary brand color, links |
| **Deep Teal** | `#0c4855` | Headers, deep backgrounds |
| **Coral Accent** | `#ff5f95` | Call-to-actions, highlights |
| **Soft White** | `#f9fafb` | Main backgrounds, cards |
| **Dark Slate** | `#1f2937` | Primary text, footer |

### Design Principles
* **Soft Shadows:** Depth without harshness (`shadow-lg`).
* **Rounded Cards:** Friendly, modern corners (`rounded-2xl`).
* **Gradient Buttons:** Premium feel (Ocean Blue to Deep Teal).
* **Clean Spacing:** Breathing room for luxury content.
* **Minimal Clutter:** Focus on task-oriented UI.

---

## Tailwind CSS v4 Configuration
This project utilizes the native CSS-first configuration of Tailwind v4, removing the need for a `tailwind.config.js` or PostCSS setup.

**Styles Entry Point:** `src/styles/tailwind.css`
```css
@import "tailwindcss";

/* Custom theme variables can be added here */
@theme {
  --color-ocean: #22b9e7;
  --color-teal: #0c4855;
  --color-coral: #ff5f95;
}
```
### Main Entry Point: src/main.jsx
`import "./styles/tailwind.css";` to use tailwind css

## 🚀 Running the Project
Install dependencies:

### Bash
`npm install
Start development server:`

### Bash
`npm run dev`
