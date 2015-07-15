# plastiq-sortable

Sortable lists for plastiq.

## example

```js
var plastiq = require('plastiq');
var h = plastiq.html;
var sortable = require('plastiq-sortable');

function render(model) {
  return sortable('li', model.items, function (item) {
    return h('li', item);
  });
}

plastiq.append(document.body, render, {items: [
  'red',
  'blue',
  'yellow'
]});
```

## api

```js
var sortable = require('plastiq-sortable');

var vdom = sortable(selector, [options], list, mapFunction);
```

* `selector` - the selector to be passed to `plastiq.html`, i.e. `'li'`.
* `options` - the options to be passed to `plastiq.html`
* `list` - the list of items from the model. Items in this list will be moved when the user sorts the list.
* `mapFunction(item)` - a function taking an item from `list`, and producing the corresponding vdom.
