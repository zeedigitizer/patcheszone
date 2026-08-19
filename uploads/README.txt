This folder is a placeholder destination for customer artwork uploaded
through the Price Calculator's file picker. The current build is a static
front-end only: the "Attach File" control keeps the file client-side to show
the file name in the quote summary. To actually receive uploaded files on
your server, wire js/calculator.js's file input up to a backend endpoint
(PHP, Node, etc.) that saves incoming uploads into this directory.
