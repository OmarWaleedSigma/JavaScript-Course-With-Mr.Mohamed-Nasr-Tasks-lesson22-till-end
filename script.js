function createFontController() {
  let fontSize = 16; // 🔒 private variable

  const text = document.getElementById("text");
  const slider = document.getElementById("slider");

  function updateFont() {
    text.style.fontSize = fontSize + "px";
    slider.value = fontSize; // keep slider synced
  }

  return {
    setSize: function (size) {
      if (size >= 10 && size <= 40) {
        fontSize = size;
        updateFont();
      }
    },

    reset: function () {
      fontSize = 16;
      updateFont();
    }
  };
}

// init controller
const controller = createFontController();

// elements
const slider = document.getElementById("slider");
const resetBtn = document.getElementById("reset");

// 🎚️ slider event
slider.addEventListener("input", function (e) {
  controller.setSize(Number(e.target.value));
});

// 🔄 reset event
resetBtn.addEventListener("click", function () {
  controller.reset();
});