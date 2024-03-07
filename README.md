## Device Sales (Next.js/MongoDB/Redux)

In this app you are able to add, edit and remove devices, new invoices and customers.   
In the back-end, the data is queried on a MongoDB Atlas database through MongoDB driver.   
The data is then set and modified in Redux state management, and shown to the user through React components.   
   
Because the components are rendered on the server by default due to the fact that Next.js is   
a framework for server side rendering websites, the components that need access to Redux state   
need to be marked as "using client", because the state is stored on the client side.

To run the project on your own computer, install Git CLI, Node.js, and npm (Node package manager).   
https://git-scm.com/book/en/v2/Getting-Started-Installing-Git   
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm   

Then, run these commands on your command-line interface.

```
cd example_directory // For example cd C:\Users\Username\Documents\Projects
git clone https://github.com/Vrezerino/Device-Sales
cd Device-Sales
npm i --legacy-peer-deps
npm run dev
```