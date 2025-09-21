# Ascent - Personal Finance Tracker

A clean, modern web application that helps you take control of your finances without the complexity. Built with vanilla HTML, CSS, and JavaScript, Ascent gives you everything you need to track your money, set budgets, and build better financial habits.

## Features 

### Dashboard Overview
The dashboard gives you a quick snapshot of your financial health. You'll see your total balance, monthly income, expenses, and savings rate all in one place. The expense categories chart shows you exactly where your money is going, which is often the first step to better financial habits.

### Transaction Management
Adding transactions is straightforward, just click "Add Income" or "Add Expense" and fill in the details. You can categorize everything from groceries to rent, and the system tracks it all. Need to edit something? Just click on any transaction to modify or delete it. The filtering options help you find specific transactions when you need them.

### Budget Management
Set spending limits for different categories and watch your progress in real-time. The visual progress bars make it easy to see if you're staying on track or going over budget. You can set budgets for different time periods (monthly, weekly, yearly) depending on what makes sense for your situation.

### Learning Center
I added a learning section with practical financial advice. Right now it includes a comprehensive guide on budgeting basics with strategies from The Money Guys, and a car buying guide with the 20/3/8 rule calculator. These aren't just generic tips - they're proven strategies that actually work.

### Reports and Analysis
The reports section shows you the bigger picture of your finances. See how your income compares to expenses, track spending by category, and identify trends over time. You can export your data if you want to do more detailed analysis elsewhere.

## Getting Started

### First Steps
1. Start by adding your income - click "Add Income" and enter your monthly salary or other income sources
2. Add some expenses to get a feel for the system
3. Go to the Budget section and set some spending limits for categories like groceries, entertainment, etc.
4. Check out the Learning section for some solid financial advice

## How It Works

### Adding Transactions
The transaction form is simple but covers everything you need. Enter a description, amount, pick a category, and you're done. The system automatically timestamps everything, but you can adjust dates if needed.

### Setting Up Budgets
Choose a category, set your spending limit, pick a time period, and save. The system will track your spending against that budget and show you how you're doing with visual progress bars.

### Understanding Your Data
The dashboard gives you the key metrics at a glance. The expense chart shows you where your money is going, which is often eye-opening. The savings rate calculation helps you see if you're actually building wealth or just treading water.

## Technical Details

### Built With
- HTML5, CSS3, and vanilla JavaScript
- Font Awesome for icons
- Chart.js for the expense visualization
- Local Storage for data persistence
- Responsive design that works on any device

## Customization

### Adding Categories
Want to add a new expense category? Just edit the `updateCategoryOptions` method in `script.js` and add your new category to the dropdown.

### Styling Changes
All the styling is in `styles.css`. The color scheme uses a dark theme with green accents, but you can easily modify the colors, fonts, or layout to match your preferences.

### Extending Functionality
The code is organized in a way that makes it easy to add new features. The modular structure means you can add new sections, modify existing functionality, or integrate with other tools without breaking anything.

## Future Plans

I'm always thinking about ways to make this better. Some ideas I'm considering:
- More learning content with practical financial strategies
- Better data visualization options
- Import/export functionality for CSV files
- Goal setting and tracking features
- Recurring transaction support

## Feedback

This is a personal project, but I'm always interested in feedback and suggestions. If you find a bug or have an idea for improvement, feel free to let me know. The code is straightforward enough that you can probably figure out how to make changes yourself.


## Final Thoughts

I built this because I wanted a simple, effective way to track my finances without all the bells and whistles that most apps throw at you. Sometimes the best solution is the simplest one. If you're looking for a no-nonsense way to get a handle on your money, this might be exactly what you need.

Take control of your finances, one transaction at a time.
