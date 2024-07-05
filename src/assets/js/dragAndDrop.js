import interact from "interactjs";

// functions-----------------------------------------------------------------

function dragMoveListener(event) {
  var target = event.target;
  //keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  //translate the element
  target.style.transform = `translate(${x}px, ${y}px)`;

  //update the position attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);

  target.style.cursor = "grabbing";
}

// event listeners-----------------------------------------------------------

window.addEventListener("load", () => {
  interact(".draggable")
    .styleCursor(false)
    .draggable({
      listeners: {
        start(event) {},
        //function called on every dragmove event
        move(event) {
          dragMoveListener(event);
        },
        //function called on every dragend event
        end(event) {
          var textElement = event.target;

          textElement &&
            (textElement.textContent =
              "moved a distance of " +
              Math.sqrt(
                (Math.pow(event.pageX - event.x0, 2) +
                  Math.pow(event.pageY - event.y0, 2)) |
                  0
              ).toFixed(2) +
              "px");

          event.target.style.cursor = "grab";
        },
      },
    });

  interact(".dropzone")
    .styleCursor(false)
    .dropzone({
      accept: "#yes-drop",
      overlap: 0.75,

      listeners: {
        dropactivate(event) {
          event.target.classList.add("drop-active");
        },
        dragenter(event) {
          var draggableElement = event.relatedTarget;
          var dropzoneElement = event.target;

          //feedback the possibility of a drop
          dropzoneElement.classList.add("drop-target");
          draggableElement.classList.add("can-drop");
          draggableElement.textContent = "Dragged in";
        },
        dragleave(event) {
          //remote the drop feedback style
          event.target.classList.remove("drop-target");
          event.relatedTarget.classList.remove("can-drop");
          event.relatedTarget.textContent = "Dragged out";
        },
        drop(event) {
          event.relatedTarget.textContent = "Dropped";
        },
        dropdeactivate(event) {
          //remove active dropzone feedback
          event.target.classList.remove("drop-active");
          event.target.classList.remove("drop-target");
        },
      },
    });

  interact(".drag-drop")
    .styleCursor(false)
    .draggable({
      listeners: {
        move(event) {
          dragMoveListener(event);
        },
        end(event) {
          event.target.style.cursor = "grab";
        },
      },
    });
});
