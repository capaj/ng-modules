ng-modules
==========

Utility for generating script includes of your angular modules, which makes it easier to manage your Angular script dependencies until you can use ES6

It is only proof of concept. Althought it does work, it is not being used in production environment. 
### Why not browserify or require.js?
While browserify is much more robust solution to your script dependencies, it requires you to compile every time you make a code change. js-modules generate normal script tags, so you only need to rebuild when you add/delete/rename script file. 
Intended purpose of this utility are big Angular.js web apps. While writing Angular, you have dependency injection, so with require.js you have to wrap your actual code twice instead of just once. This I believe is not easily maintainable. So require.js is also out of the picture.
