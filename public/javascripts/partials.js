+function () {
  Handlebars.registerPartial('header', document.getElementById('header').innerHTML);
  Handlebars.registerPartial('footer', document.getElementById('footer').innerHTML);
  Handlebars.registerPartial('navigation-bar', document.getElementById('navigation-bar').innerHTML);
}();
