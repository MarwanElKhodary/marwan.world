import interact from "interactjs";

// functions-----------------------------------------------------------------

function dragMoveListener(event) {
  var target   = event.target;
  var dataName = target.getAttribute('data-name');
  var label    = document.getElementById(dataName + "-label");
  label.style.visibility = "hidden";

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
  interact(".drag-drop")
  .styleCursor(false)
  .draggable({
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: true,
      }),
    ],
    listeners: {
        move(event) {
          dragMoveListener(event);
        },
        end(event) {
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
});
