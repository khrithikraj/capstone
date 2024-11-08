import { dashboard, expenses, trend, book } from '../utils/Icons';  // Import the 'book' icon

export const menuItems = [
    {
        id: 1,
        title: 'Home',
        icon: dashboard,
        link: '/dashboard'
    },
    {
        id: 3,
        title: "Incomes",
        icon: trend,
        link: "/dashboard",
    },
    {
        id: 4,
        title: "Expenses",
        icon: expenses,
        link: "/dashboard",
    },
    {
        id: 5,
        title: "Prediction",
        icon: dashboard,
        link: "/prediction"
    },
    {
        id: 6,   // Unique ID for the Notes page
        title: "Notes",
        icon: book,   // Use the book icon
        link: "/notes"   // Link to the Notes page
    },
];
