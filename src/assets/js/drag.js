import interact from "interactjs";

let currentAccept = "#cpu";

// functions-----------------------------------------------------------------

function dragMoveListener(pEvent) {
  var target   = pEvent.target;
  var dataName = target.getAttribute('data-name');
  var label    = document.getElementById(dataName + "-label");
  label.style.display = "none";

  //keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + pEvent.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + pEvent.dy;

  //translate the element
  target.style.transform = `translate(${x}px, ${y}px)`;

  //update the position attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);

  target.style.cursor = "grabbing";
}

function setDropzoneAccept(pNewAccept) {
  currentAccept = pNewAccept;
  interact(".dropzone").dropzone({
    accept: currentAccept,
    overlap: 0.2
  });
}

// event listeners-----------------------------------------------------------

window.addEventListener("load", () => {
  interact(".drag-drop")
  .styleCursor(false)
  .draggable({
    // modifiers: [
    //   interact.modifiers.restrictRect({
    //     restriction: "parent",
    //     endOnly: true,
    //   }),
    // ],
    listeners: {
        move(pEvent) {
          dragMoveListener(pEvent);
        },
        end(pEvent) {
          pEvent.target.style.cursor = "grab";
        },
      },
    });
  
  interact(".dropzone")
    .styleCursor(false)
    .dropzone({
      accept: currentAccept, //TODO: Add logic for accepting different drops
      overlap: 0.2,

      listeners: {
        dropactivate(pEvent) {
          pEvent.target.classList.add("drop-active");
        },
        dragenter(pEvent) {
          // var draggableElement = event.relatedTarget;
          // var dropzoneElement = event.target;

          //feedback the possibility of a drop
          // dropzoneElement.classList.add("drop-target");
          // draggableElement.classList.add("can-drop");
          // draggableElement.textContent = "Dragged in";
          console.log('dragged in');
        },
        dragleave(pEvent) {
          //remote the drop feedback style
          // event.target.classList.remove("drop-target");
          // event.relatedTarget.classList.remove("can-drop");
          // event.relatedTarget.textContent = "Dragged out";
          console.log('dragged out');
        },
        drop(pEvent) {
          const droppedIcon = pEvent.relatedTarget;
          const dropzone    = pEvent.target;
          const parentDiv   = dropzone.parentNode;

          var dropzoneId = dropzone.getAttribute('id');
          var label      = document.getElementById(dropzoneId + "-label");

          droppedIcon.style.display = "none";
          dropzone.style.display = "none";
          label.style.display = "none";

          parentDiv.innerHTML = `
            <svg class="text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline size-9/12" id="cpu-on-motherboard">
              <use href="/src/svg/cpu-on-motherboard.svg#cpu-on-motherboard"></use>
            </svg>
          `;
        },
        dropdeactivate(pEvent) {
          //remove active dropzone feedback
          pEvent.target.classList.remove("drop-active");
          pEvent.target.classList.remove("drop-target");
        },
      },
    });
});
