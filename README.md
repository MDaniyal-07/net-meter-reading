# ⚡ Net Meter - Electricity Usage Tracker

A modern, responsive web application for tracking daily electricity usage with comprehensive import/export monitoring, historical data management, and professional reporting capabilities.


## 🎯 Features

### 📊 **Real-time Usage Calculations**
- **4 Separate Tracking Categories:**
  - Total Peak Import Usage
  - Total Off-Peak Import Usage  
  - Total Peak Export Usage
  - Total Off-Peak Export Usage
- **Live Calculations** as you type current readings
- **Color-coded Values** (Red for consumption, Green for export)

### 📈 **Smart Data Management**
- **Manual Baseline Control** - Previous values only update when you choose
- **Daily Usage Tracking** from monthly baselines
- **Historical Data Storage** with local browser persistence
- **Individual Record Deletion** with confirmation dialogs

### 💾 **Data Export & Import**
- **CSV Export** functionality for data analysis
- **Responsive Historical Data Table** with filtering options
- **Professional Presentation** ready for board meetings

### 🎨 **Modern UI/UX**
- **Fully Responsive Design** (Desktop, Tablet, Mobile)
- **Glass-morphism Design** with professional color scheme
- **Sans-serif Typography** for readability
- **Smooth Animations** and hover effects

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in browser

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/net-meter.git
   cd net-meter
   ```

2. **Open the application:**
   ```bash
   # Simply open index.html in your web browser
   open index.html
   # or double-click the index.html file
   ```

3. **Start tracking:**
   - Enter your current meter readings
   - View real-time usage calculations
   - Save daily data and manage your electricity monitoring

## 📖 How to Use

### 🔄 **Daily Workflow**
1. **Enter Current Readings** in the input fields:
   - Peak Import Value
   - Peak Export Value  
   - Off Peak Import Value
   - Off Peak Export Value

2. **View Real-time Calculations** in Daily Usage Summary

3. **Save Daily Data** by clicking "Save Current Readings"
   - Saves usage data to history
   - Keeps previous values unchanged
   - Maintains monthly baseline

### 📅 **Monthly Workflow**
- At month end, click **"Update Previous Reading Values"**
- This resets your baseline for the new month
- Previous values become the new reference point

### 🗂️ **Data Management**
- **View History**: Check the Historical Data table
- **Filter Data**: Use dropdown to view Last 7/30 days or all data
- **Delete Records**: Click red trash icon to remove individual entries
- **Export Data**: Download CSV file for external analysis

## 🛠️ Technical Details

### **File Structure**
```
net-meter/
├── index.html          # Main application structure
├── styles.css          # Responsive styling and design
├── script.js           # Core functionality and logic
└── README.md           # Documentation
```

### **Technologies Used**
- **HTML5** - Semantic structure and accessibility
- **CSS3** - Modern styling with flexbox/grid layouts
- **Vanilla JavaScript** - Core functionality without dependencies
- **Local Storage API** - Data persistence
- **Responsive Design** - Mobile-first approach

### **Browser Compatibility**
- ✅ Chrome 60+
- ✅ Firefox 55+  
- ✅ Safari 12+
- ✅ Edge 79+

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Desktop**: 1200px+ (4-column layout)
- **Tablet**: 768px-1199px (2-column layout)  
- **Mobile**: <768px (single column layout)

## 🔒 Data Privacy

- **100% Client-side**: No data sent to external servers
- **Local Storage**: All data is stored in your browser
- **No Tracking**: No analytics or tracking scripts
- **Offline Capable**: Works without internet connection

## 🏆 Acknowledgments

- Icons from [Heroicons](https://heroicons.com/)
- Design inspiration from modern dashboard interfaces
- Built with ❤️ for efficient electricity monitoring

---

**⚡ Start tracking your electricity usage today and take control of your energy consumption!** 
