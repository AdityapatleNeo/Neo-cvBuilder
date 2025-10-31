to run this project please extract file open terminal and enter command npm install in both resume-generator and server folder

how to run frontend 
navigate inside resume-generator and enter npm run dev on terminal 

for backend 
navigate server folder and enter node src/index.js


/cv-builder
  /resume-generator         ← React (JS) frontend
    public
    package.json
    /src
      index.js
      App.js
      /assets
        dummayResume.js
      /pages
        RegisterPage.js
        LoginPage.js
        Dashboard.js
        FresherLayout.js
        Pdf.js
      /components
        Footer.js
      /protectedRoute
        Protected.js
        
  /server                  ← Node (JS) frontend
    /src
      index.js
      config.js
      razorPay.js
    
      /controllers
        authController.js
        paymentController.js
        resumeController.js
      /routes
        authRoutes.js
        auth.js
        resumeRutes.js
        payment.js
      /models
        User.js
        Resume.js
        SocialUser.js
      /middlewares
        authMiddleware.js

      .env
      package.json