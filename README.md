# 🚀 Advanced Form Builder

A modern, feature-rich form builder built with React and Tailwind CSS. Create beautiful forms with drag-and-drop functionality, real-time preview, and multi-step capabilities.

![Form Builder Demo](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Form+Builder+Demo)

## ✨ Features

### 🎯 Core Functionality
- **Drag & Drop Interface** - Intuitive field placement and reordering
- **Field Types** - Text, Textarea, Email, Phone, Number, Date, Checkbox, Radio, Dropdown
- **Real-time Preview** - See changes instantly as you build
- **Field Configuration** - Customize labels, placeholders, validation, and help text
- **Form Validation** - Built-in validation with error handling

### 📱 Responsive Design
- **Multi-device Preview** - Desktop, Tablet, and Mobile views
- **Responsive Forms** - Forms adapt to any screen size

### 🔧 Advanced Features
- **Multi-step Forms** - Break long forms into manageable steps
- **Progress Tracking** - Visual progress indicators
- **Template System** - Pre-built templates and custom saves
- **Form Sharing** - Generate shareable links and form IDs
- **Local Storage** - Automatic form saving and loading

### 📊 Form Management
- **Template Library** - Contact forms, surveys, and more
- **Save & Load** - Persistent form storage
- **Export Options** - Generate shareable URLs

## 🛠️ Tech Stack

- **Frontend**: React with Hooks
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Browser Local Storage
- **Build Tool**: Vite/CRA compatible

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/form-builder.git
   cd form-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### Building Your First Form

1. **Set Form Details**
   - Enter form title and description
   - Toggle multi-step if needed

2. **Add Fields**
   - Click field types from the sidebar
   - Drag to reorder fields
   - Click fields to edit properties

3. **Configure Fields**
   - Set labels and placeholders
   - Add validation rules
   - Configure help text

4. **Preview & Test**
   - Switch to Preview mode
   - Test on different devices
   - Validate form behavior

5. **Save & Share**
   - Save your form
   - Generate shareable link
   - Share with users

### Field Types Available

| Field Type | Description | Validation |
|------------|-------------|------------|
| Text | Single line text input | Min/Max length |
| Textarea | Multi-line text area | Min/Max length |
| Email | Email input with validation | Email format |
| Phone | Phone number input | Phone format |
| Number | Numeric input | Min/Max value |
| Date | Date picker | Date range |
| Checkbox | Multiple choice options | Required selection |
| Radio | Single choice options | Required selection |
| Dropdown | Select from options | Required selection |

### Multi-Step Forms

Enable multi-step functionality to break long forms into sections:

- **Step Configuration**: Set fields per step
- **Progress Tracking**: Visual progress bar
- **Navigation**: Previous/Next buttons
- **Validation**: Step-by-step validation

## 🎨 Customization

### Styling
The form builder uses Tailwind CSS for styling. Customize colors and appearance by modifying the CSS classes in the components.

## 📁 Project Structure

```
src/
├── components/
│   ├── FormBuilder.jsx      # Main component
│   ├── FieldRenderer.jsx    # Field rendering logic
│   ├── PropertiesPanel.jsx  # Field configuration
│   └── PreviewMode.jsx      # Form preview
├── utils/
│   ├── validation.js        # Validation logic
│   ├── storage.js          # Local storage helpers
│   └── fieldTypes.js       # Field type definitions
├── styles/
│   └── globals.css         # Global styles
└── App.jsx                 # Root component
```

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [Vite](https://vitejs.dev/) - Build tool
