var plastiq = require('plastiq');
var h = plastiq.html;
var sortable = require('.');

function render() {
  return h('div',
    h('button', {onclick: function (ev) {ev.preventDefault();}}, 'refresh'),
    h('h1', 'sortable'),
    h('pre code', JSON.stringify(model.items)),
    renderExample(function () {
      return renderHierarchy(model.bigItems);
    })
  );
}

function renderExample(fn) {
  return h('.example',
    h('.left', fn()),
    h('.right', fn())
  );
}

function renderHierarchy(hierarchy) {
  return sortable('ul', hierarchy, function (item) {
    return h('li',
      h('h3', item.name),
      sortable('ul', item.items, function (subitem) {
        if (item.name == 'Colours') {
          return h('li', {style: {'background-color': subitem}}, subitem);
        } else {
          return h('li', subitem);
        }
      })
    );
  });
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
