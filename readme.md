# hyperdom-sortable

Sortable lists for hyperdom.

## example

```js
var hyperdom = require('hyperdom');
var h = hyperdom.html;
var sortable = require('hyperdom-sortable');

function render(model) {
  return sortable('li', model.items, function (item) {
    return h('li', item);
  });
}

hyperdom.append(document.body, render, {items: [
  'red',
  'blue',
  'yellow'
]});
```

## api

```js
var sortable = require('hyperdom-sortable');

var vdom = sortable(selector, [options], list, mapFunction);
```

* `selector` - the selector to be passed to `hyperdom.html`, i.e. `'li'`.
* `options` - the options to be passed to `hyperdom.html`
* `options.moveItem(fromIndex, toIndex)` - optional, called to move the item in `list` from `fromIndex` to `toIndex`. If not provided, the item is moved in `item`.
* `options.onitemmoved(item, fromIndex, toIndex)` - called after an item in the list was moved.
* `list` - the list of items from the model. Items in this list will be moved when the user sorts the list.
* `mapFunction(item)` - a function taking an item from `list`, and producing the corresponding vdom.
