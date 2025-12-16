# Digital Life Lessons – Frontend

**Live Website:**  
https://digital-life-lesson-28f26.web.app/


---

## About the Project

Digital Life Lessons is a modern, full-featured web platform where users can create, preserve, and explore meaningful life lessons. The platform encourages self-reflection, personal growth, and community learning through both free and premium content.

This frontend application is built with a clean user interface, smooth interactions, and secure authentication to ensure a high-quality and professional user experience across all devices.

---

## Key Features

- Secure authentication system using Firebase  
  - Email and password based login  
  - Google authentication support  

- Life lesson creation and management  
  - Create, update, and delete lessons  
  - Assign category and emotional tone  
  - Control visibility (public or private)  
  - Control access level (free or premium)  

- Public lessons browsing system  
  - Search lessons by title or keyword  
  - Filter lessons by category and emotional tone  
  - Sort lessons by newest or most saved  
  - Pagination for better performance  

- Premium content handling  
  - Premium lessons are blurred for free users  
  - Upgrade prompt shown for locked content  
  - Seamless upgrade experience  

- User engagement features  
  - Like and unlike lessons with real-time updates  
  - Save lessons to favorites  
  - Comment system for logged-in users  
  - Report inappropriate or misleading lessons  
  - Social media sharing support  

- Stripe payment integration  
  - One-time lifetime premium purchase  
  - Secure Stripe Checkout  
  - Payment success and cancellation handling  

- User dashboard  
  - Total lessons created  
  - Total saved favorites  
  - Recently added lessons  
  - Quick access to important actions  
  - Basic analytics overview  

- Role-based dashboard system  
  - Separate user and admin dashboards  
  - Admin moderation and management tools  

- Professional UI and UX  
  - Consistent typography and color system  
  - Uniform button styles  
  - Balanced spacing and alignment  
  - Smooth animations using Framer Motion  

- Loading and feedback states  
  - Global loading spinner  
  - Lottie animations for enhanced feedback  
  - Toast and modal-based notifications  

---

## Technologies Used

- React.js  
- React Router DOM  
- Firebase Authentication  
- Tailwind CSS  
- Framer Motion  
- Axios  
- Stripe Checkout  
- SweetAlert and Toast Notifications  
- Lottie React  
- JWT-based secure API communication  

---

## Project Highlights

- All frontend routes are reload-safe  
- No private route crashes on refresh  
- Environment variables are properly secured  
- No default browser alerts are used  
- Fully responsive for mobile, tablet, and desktop  
- Clean and meaningful GitHub commit history with more than 20 commits  

---

## User Roles

- Free User  
  - Can access all public free lessons  

- Premium User  
  - Can access both free and premium public lessons  
  - Can create premium lessons  

- Admin  
  - Can monitor platform activity  
  - Can moderate users and lessons  
  - Can manage featured and reported content  

---

## UI Design Philosophy

- Equal height and width cards across all sections  
- Grid-based layout for visual consistency  
- Consistent heading styles across the application  
- Balanced spacing for readability  
- Accessibility-focused and modern design approach
