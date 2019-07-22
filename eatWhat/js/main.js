$(document).ready(function() {
  var outerWidth = window.outerWidth;
  var count = 0;
  var restaurant = [
    "Salmon Samurai",
    "Tanjong Pagar Hawker",
    "PSA",
    "100am",
    "Tongkatsu King",
    "Yong Tau Fu",
    "Siew Lup(Rubbish)",
    "Fish Soup",
    "Coffeehive",
    "McDonald",
    "Prawn Noodle",
    "Thai Food",
    "Takeaway(Tapau)",
    "Malay Food",
    "Chicken Rice",
    "Mixed Rice"
  ];
  if (outerWidth < 500) {
    createFields(16, "item", 100);
  } else {
    createFields(16, "item", 155);
  }
  $(".rotate").click(function() {
    disableRotateButton();
    var random = Math.random() * 360 * 20;
    count += random;
    $(".wheel").css("transform", "rotate(" + count + "deg)");
    setTimeout(function() {
      enableRotateButton();
    }, 5000);
  });

  function createFields(numberOfItems, className, radius) {
    var container = $(".wheel");
    for (var i = 0; i < +numberOfItems; i++) {
      $("<div/>", {
        class: "field " + className,
        text: restaurant[i]
      }).appendTo(container);
    }

    var fields = $("." + className),
      container = $(".wheel"),
      width = container.width(),
      height = container.height(),
      angle = 0,
      count = 0,
      step = (2 * Math.PI) / fields.length;

    fields.each(function() {
      var x = Math.round(width / 2 + radius * Math.cos(angle) - $(this).width() / 2);
      var y = Math.round(height / 2 + radius * Math.sin(angle) - $(this).height() / 2);
      if (window.console) {
        console.log($(this).text(), x, y);
      }
      $(this).css({
        left: x + "px",
        top: y + "px",
        transform: "rotate(" + count * (360 / 16) + "deg)"
      });
      angle += step;
      count += 1;
    });
  }
});

const disableRotateButton = function() {
  $(".rotate").addClass("disabled");
  $(".rotate").attr("disabled", "true");
};

const enableRotateButton = function() {
  $(".rotate").removeClass("disabled");
  $(".rotate").removeAttr("disabled");
};
