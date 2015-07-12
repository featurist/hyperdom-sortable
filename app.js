var plastiq = require('plastiq');
var h = plastiq.html;
var sortable = require('.');

function render() {
  return h('div',
    h('button', {onclick: function (ev) {ev.preventDefault();}}, 'refresh'),
    h('h1', 'sortable'),
    h('pre code', JSON.stringify(model.items)),
    sortable('ul', model.cars, function (car) {
      return h('li', car);
    }),
    sortable('ul', model.bigItems, function (bigItem) {
      return h('li',
        h('h3', bigItem.name),
        sortable('ul', bigItem.items, function (item) {
          if (bigItem.name == 'Colours') {
            return h('li', {style: {'background-color': item}}, item);
          } else {
            return h('li', item);
          }
        })
      );
    }),
    h('ul', model.colours.map(function (item) {
      return h('li', {style: {'background-color': item}}, item);
    }))
  );
}

var colours = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'magenta',
  'cyan'
];

var cars = [
  'Ferrari',
  'Hummer',
  'Volkswagen',
  'Snowmobile'
];

var lakes = [
  'Lac Annecy',
  'Lac Leman',
  'Lake Munga'
];

var model = {
  colours: colours,
  cars: cars,
  lakes: lakes,
  bigItems: [
    {
      name: 'Cars',
      items: cars
    },
    {
      name: 'Colours',
      items: colours
    },
    {
      name: 'Lakes',
      items: lakes
    }
  ]
};

plastiq.append(document.body, render);
