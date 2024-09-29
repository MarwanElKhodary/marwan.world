import interact from "interactjs";

// constants-----------------------------------------------------------------

const DATA_X             = "data-x";
const DATA_Y             = "data-y";
const NONE               = "none";
const LABEL              = "-label";
const MOTHERBOARD        = "motherboard";
const CPU_ON_MOTHERBOARD = "cpu-on-motherboard";

const DZ_CPU    = "#cpu";
const DZ_COOLER = '#cooler';

// global variables----------------------------------------------------------

let currentAccept   = DZ_CPU;
let currentDropzone = MOTHERBOARD;

// functions-----------------------------------------------------------------

function dragMoveListener(pEvent) {
  var target   = pEvent.target;
  var dataName = target.getAttribute('data-name');
  var label    = document.getElementById(dataName + LABEL);
  label.style.display = NONE;

  //keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute(DATA_X)) || 0) + pEvent.dx;
  var y = (parseFloat(target.getAttribute(DATA_Y)) || 0) + pEvent.dy;

  //translate the element
  target.style.transform = `translate(${x}px, ${y}px)`;

  //update the position attributes
  target.setAttribute(DATA_X, x);
  target.setAttribute(DATA_Y, y);

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
        start(pEvent) {
          if (currentDropzone === MOTHERBOARD) {
            setDropzoneAccept(DZ_CPU);
          } else if (currentDropzone === CPU_ON_MOTHERBOARD) {
            setDropzoneAccept(DZ_COOLER);
          }
        },
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
      accept: currentAccept,
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
          var label      = document.getElementById(dropzoneId + LABEL);

          droppedIcon.style.display = NONE;
          dropzone.style.display = NONE;
          label.style.display = NONE;

          parentDiv.innerHTML = `
            <svg class="text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline size-9/12" id="cpu-on-motherboard">
              <use href="/src/svg/cpu-on-motherboard.svg#cpu-on-motherboard"></use>
            </svg>
          `;
          // currentDropzone = "cpu-on-motherboard"; //set currentDropzone here
        },
        dropdeactivate(pEvent) {
          //remove active dropzone feedback
          pEvent.target.classList.remove("drop-active");
          pEvent.target.classList.remove("drop-target");
        },
      },
    });
});
