var plastiq = require('plastiq');
var h = plastiq.html;
var $ = require('jquery');
window.$ = $;

function listElement(element) {
  return element;
}

module.exports = function (selector, items, map) {
  var refresh = h.refresh;

  function moveItem(from, to) {
    items.splice(to, 0, items.splice(from, 1)[0]);
    refresh();
  }

  return h.component(
    {
      items: items,

      onadd: function (element) {
        this.state = 'asdfasdf';
        this.setup(element);
      },

      onupdate: function (element) {
      },

      moveItem: function(from, to) {
        this.items.splice(to, 0, this.items.splice(from, 1)[0]);
        refresh();
      },

      setup: function (containerElement) {
        var list = listElement(containerElement);

        function draggableTarget(element) {
          var child = element;

          while (child.parentNode && child.parentNode != containerElement) {
            child = child.parentNode;
          }

          return child;
        }

        var self = this;

        list.addEventListener('dragover', function (e) {
          if (!self.dragged) {
            return;
          }

          var target = draggableTarget(e.target);
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
          var relY = e.clientY + window.scrollY - $(self.over).offset().top;
          var height = self.over.offsetHeight / 2;

          if(relY > height) {
            self.nodePlacement = "after";
            list.insertBefore(self.placeholder, target.nextElementSibling);
          }
          else if(relY < height) {
            self.nodePlacement = "before"
            list.insertBefore(self.placeholder, target);
          }
        });

        var items = list.children;

        list.addEventListener('dragstart', function (e) {
          var currentTarget = draggableTarget(e.target);
          self.dragged = currentTarget;
          e.dataTransfer.effectAllowed = 'move';
          self.placeholder = document.createElement(self.dragged.tagName);
          self.placeholder.className = "placeholder";
          $(self.placeholder).css('display', $(self.dragged).css('display'));
          $(self.placeholder).height($(self.dragged).height());
          $(self.placeholder).height($(self.dragged).height());
          
          // Firefox requires dataTransfer data to be set
          e.dataTransfer.setData("text/html", currentTarget);
          e.stopPropagation();
        });

        list.addEventListener('drag', function (e) {
          if (!self.placeholder.parentNode) {
            list.insertBefore(self.placeholder, self.dragged.nextElementSibling);
          }
          e.stopPropagation();
        });

        list.addEventListener('dragend', function (e) {
          self.dragged.style.display = "block";
          self.dragged.parentNode.removeChild(self.placeholder);

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
            self.moveItem(from, to);
            delete self.dragged;
            delete self.over;
          }
          e.stopPropagation();
        });
      }
    },
    h(selector, items.map(function (item, index) {
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
