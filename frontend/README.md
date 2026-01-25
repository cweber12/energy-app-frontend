# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### Components Folder

A Component is one of the core building blocks of React. They have the same purpose as JavaScript functions and return HTML. Components make the task of building UI much easier. A UI is broken down into multiple individual pieces called components. You can work on components independently and then merge them all into a parent component which will be your final UI. 

### Contexts Folder

This directory contains files related to managing global state using the React Context API. Contexts are used to share state across multiple components without having to pass props manually through each level of the component tree.

### Hooks Folder

Hooks provide access to states for functional components while creating a React application. It allows you to use state and other React features without writing a class. Placing them in a dedicated directory allows for easy access and reuse across components throughout your application.

### Services Folder

In this directory, you'll find files responsible for handling API calls and other services. Services keeps the implementation details of interacting with external resources, provides separation of concerns and code maintainability.

### Utils Folder

Utility functions, such as date formatting or string manipulation, are stored in this directory. These functions are typically used across multiple components or modules and serve to centralize commonly used logic.

### Assets Folder

Static assets like images, icons, fonts, and other media files are stored in the assets folder. Organizing assets in a dedicated directory keeps your project clean and makes it easy to locate and manage these files.

### Config Folder

This folder contains of a configuration file where we store environment variables in config.js. We will use this file to set up multi-environment configurations in your application. Ex- Environment Configuration, WebPack Configuration, Babel Configuration, etc.

### Styles Folder

This directory contains CSS or other styling files used to define the visual appearance of your application. In this folder styles of different components are stored here.
