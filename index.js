var hyperdom = require('hyperdom');
var h = hyperdom.html;

module.exports = function (selector_, options_, items_, map_) {
  var refresh = h.refresh;

  var selector, options, items, map;
  
  if (map_) {
    selector = selector_;
    options = options_;
    items = items_;
    map = map_;
  } else {
    selector = selector_;
    options = {};
    items = options_;
    map = items_;
  }

  if (options.moveItem) {
    options.moveItem = h.refreshify(options.moveItem);
  }

  return h.component(
    {
      items: items,

      onadd: function (element) {
        this.setup(element);
      },

      onupdate: function (element) {
      },

      moveItem: function(from, to) {
        if (options.moveItem) {
          options.moveItem(from, to);
        } else {
          var item = this.items[from];

          this.items.splice(to, 0, this.items.splice(from, 1)[0]);

          if (options.onitemmoved) {
            options.onitemmoved(item, from, to);
          }

          refresh();
        }
      },

      setup: function (listElement) {
        var self = this;

        listElement.addEventListener('dragover', function (e) {
          if (!self.dragged) {
            return;
          }

          var target = itemElementContaining(e.target, listElement);
          if (!target) {
            return;
          }

          e.preventDefault();
          e.stopPropagation();

          self.dragged.style.display = "none";
          if(target == self.placeholder) return;
          if(target == self.dragged) return;
          self.over = target;
          // Inside the dragOver method
          var relY = e.clientY + window.scrollY - offset(self.over).top;
          var height = self.over.offsetHeight / 2;

          if(relY > height) {
            self.nodePlacement = "after";
            listElement.insertBefore(self.placeholder, target.nextElementSibling);
          }
          else if(relY < height) {
            self.nodePlacement = "before"
            listElement.insertBefore(self.placeholder, target);
          }
        });

        listElement.addEventListener('dragstart', function (e) {
          var currentTarget = itemElementContaining(e.target, listElement);
          self.dragged = currentTarget;
          self.placeholder = createPlaceholder(self.dragged);
          
          // Firefox requires dataTransfer data to be set
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData("text/html", currentTarget);
          e.stopPropagation();
        });

        listElement.addEventListener('drag', function (e) {
          if (!self.placeholder.parentNode) {
            listElement.insertBefore(self.placeholder, self.dragged.nextElementSibling);
          }
          e.stopPropagation();
        });

        listElement.addEventListener('dragend', function (e) {
          self.dragged.style.display = '';
          listElement.removeChild(self.placeholder);
          delete self.placeholder;

          // Update data
          var fromString = self.dragged.dataset.draggableId;
          var from = Number(self.dragged.dataset.draggableId);
          if (self.over) {
            var toString = self.over.dataset.draggableId;
            var to = Number(self.over.dataset.draggableId);
            if(from < to) {
              to--;
            }
            if(self.nodePlacement == "after") {
              to++;
            }
            if (from != to) {
              self.moveItem(from, to);
            }
            delete self.dragged;
            delete self.over;
            delete self.nodePlacement;
          }
          e.stopPropagation();
        });
      }
    },
    h(selector, options, items.map(function (item, index) {
      var child = map(item);

      if (!child.properties.dataset) {
        child.properties.dataset = {};
      }
      child.properties.dataset.draggableId = index;
      child.properties.draggable = true;

      return child;
    }))
  );
};

function offset(element) {
  var offset = {top: element.offsetTop, left: element.offsetLeft};
  var parent = element.offsetParent;

  while (parent != null) {
    offset.left += parent.offsetLeft;
    offset.top  += parent.offsetTop;
    parent = parent.offsetParent;
  }

  return offset;
}

function itemElementContaining(element, listElement) {
  var child = element;

  while (child.parentNode && child.parentNode != listElement) {
    child = child.parentNode;
  }

  return child;
}

function createPlaceholder(original) {
  var placeholder = document.createElement(original.tagName);
  placeholder.className = "placeholder";
  placeholder.style.padding = '0';
  placeholder.style.border = 'none';
  var style = getComputedStyle(original);
  placeholder.style.display = style.display;
  placeholder.style.height = String(original.offsetHeight) + 'px';
  return placeholder;
}
