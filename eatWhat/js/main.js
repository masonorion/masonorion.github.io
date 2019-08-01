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

$(document).ready(function() {
  var outerWidth = window.outerWidth;
  var count = 0;

  if (outerWidth < 500) {
    createFields(16, "item", 100);
  } else {
    createFields(16, "item", 155);
  }

  initD3();

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

function initD3() {
  var padding = { top: 20, right: 40, bottom: 0, left: 0 },
    w = 500 - padding.left - padding.right,
    h = 500 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.category20(); //category20c()
  //randomNumbers = getRandomNumbers();

  var data = generateFoodList();

  data.map((value, index) => {
    $("#foodList").prepend(
      $(
        `
            <div class="list-item">
              ${value.name}<span class="delete" data-index="${index}"
                ><svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  class=""
                  data-icon="delete"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"
                  ></path></svg
              ></span>
            </div>
          `
      )
    );
  });

  initWheel();

  $(document).on("click", ".list-item .delete", function(e) {
    e.preventDefault();
    if (data.length < 3) {
      alert("You must have 2 selection bro");
      return;
    }
    var currIndex = $(this).data("index");
    console.log(currIndex);
    $("#foodList").empty();
    data.splice(currIndex, 1);
    data.map((value, index) => {
      $("#foodList").prepend(
        $(
          `
            <div class="list-item">
              ${value.name}<span class="delete" data-index="${index}"
                ><svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  class=""
                  data-icon="delete"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"
                  ></path></svg
              ></span>
            </div>
          `
        )
      );
    });

    $("#chart").empty();

    initWheel();
  });

  if ($("#foodList")[0].scrollHeight > $("#foodList").height()) {
    $(".food-list-wrapper").addClass("more-bottom");
  }

  $("#foodList").on("scroll", function() {
    var moreTop = $("#foodList").scrollTop();

    var moreBottom = $(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight;

    if (moreTop !== 0) {
      $(".food-list-wrapper").addClass("more-top");
      $(".food-list-wrapper").addClass("more-bottom");
    } else {
      $(".food-list-wrapper").removeClass("more-top");
    }

    if (moreBottom) {
      $(".food-list-wrapper").removeClass("more-bottom");
    }
  });

  $("#add-item").click(function(e) {
    e.preventDefault();

    var newItem = prompt("Please enter your new choice", "");

    data.push({
      label: "Choice " + data.length,
      value: 1,
      name: newItem
    });

    $("#foodList").empty();
    data.map((value, index) => {
      $("#foodList").prepend(
        $(
          `
            <div class="list-item">
              ${value.name}<span class="delete" data-index="${index}"
                ><svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  class=""
                  data-icon="delete"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"
                  ></path></svg
              ></span>
            </div>
          `
        )
      );
    });

    $("#chart").empty();

    initWheel();
  });

  function initWheel() {
    var svg = d3
      .select("#chart")
      .append("svg")
      .data([data])
      .attr("width", w + padding.left + padding.right)
      .attr("height", h + padding.top + padding.bottom);

    var container = svg
      .append("g")
      .attr("class", "chartholder")
      .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");

    var vis = container.append("g");

    var pie = d3.layout
      .pie()
      .sort(null)
      .value(function(d) {
        return 1;
      });

    // declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);

    // select paths, use arc generator to draw
    var arcs = vis
      .selectAll("g.slice")
      .data(pie)
      .enter()
      .append("g")
      .attr("class", "slice");

    arcs
      .append("path")
      .attr("fill", function(d, i) {
        return color(i);
      })
      .attr("d", function(d) {
        return arc(d);
      });

    // add the text
    arcs
      .append("text")
      .attr("transform", function(d) {
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle) / 2;
        return "rotate(" + ((d.angle * 180) / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
      })
      .attr("text-anchor", "end")
      .text(function(d, i) {
        return data[i].name;
      });

    container.on("click", spin);

    function spin(d) {
      container.on("click", null);

      //all slices have been seen, all done
      console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
      if (oldpick.length == data.length) {
        console.log("done");
        container.on("click", null);
        return;
      }

      var ps = 360 / data.length,
        pieslice = Math.round(1440 / data.length),
        rng = Math.floor(Math.random() * 1440 + 360);

      rotation = Math.round(rng / ps) * ps;

      picked = Math.round(data.length - (rotation % 360) / ps);
      picked = picked >= data.length ? picked % data.length : picked;

      if (oldpick.indexOf(picked) !== -1) {
        d3.select(this).call(spin);
        return;
      } else {
        oldpick.push(picked);
      }

      rotation += 90 - Math.round(ps / 2);

      vis
        .transition()
        .duration(3000)
        .attrTween("transform", rotTween)
        .each("end", function() {
          //mark name as seen
          d3.select(".slice:nth-child(" + (picked + 1) + ")").attr("style", "opacity: 0.2");

          //populate name
          d3.select("#name h1").text(data[picked].name);

          oldrotation = rotation;

          container.on("click", spin);
        });

      $("#chart").addClass("disabled");

      setTimeout(function() {
        $("#chart").removeClass("disabled");
      }, 3000);
    }

    //make arrow
    svg
      .append("g")
      .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + (h / 2 + padding.top) + ")")
      .append("path")
      .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z")
      .style({ fill: "black" });

    //draw spin circle
    container
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 60)
      .style({ fill: "white", cursor: "pointer" });

    //spin text
    container
      .append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text("SPIN")
      .style({ "font-weight": "bold", "font-size": "30px" });

    function rotTween(to) {
      var i = d3.interpolate(oldrotation % 360, rotation);
      return function(t) {
        return "rotate(" + i(t) + ")";
      };
    }

    function getRandomNumbers() {
      var array = new Uint16Array(1000);
      var scale = d3.scale
        .linear()
        .range([360, 1440])
        .domain([0, 100000]);

      if (window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function") {
        window.crypto.getRandomValues(array);
        console.log("works");
      } else {
        //no support for crypto, get crappy random numbers
        for (var i = 0; i < 1000; i++) {
          array[i] = Math.floor(Math.random() * 100000) + 1;
        }
      }

      return array;
    }
  }

  function generateFoodList() {
    return restaurant.map((value, index) => {
      return {
        label: "Choice " + index,
        value: 1,
        name: value
      };
    });
  }
}
