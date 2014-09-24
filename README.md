ng-modules
==========

Utility for generating script includes of your angular modules, which makes it easier to manage your Angular script dependencies until you can use ES6

It is only proof of concept. Althought it does work, it is not being used in production environment. After writing this prototype, I trully believe that the best js module solution until ES6 is [browserify](http://browserify.org/) or [duo](https://github.com/duojs/duo).

### Why not require.js?
Intended purpose of this utility are big Angular.js web apps. While writing Angular, you have dependency injection, so with require.js you have to wrap your actual code twice instead of just once. This I believe is not easily maintainable. So require.js is also out of the picture.
