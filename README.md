## Device Sales (Next.js/MongoDB/Redux)

Many components in this application share invoice data and would benefit from a centralized state, 
but accessing state isn't nearly as complex as querying the database in various ways. Therefore for 
demo purposes, components that need invoice data fetch it from the database and, for now, Redux
will only hold e.g. login data, which is overkill for now. However if the app grows, so will the need
for centralized state for sure.