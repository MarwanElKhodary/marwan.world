import interact from "interactjs";

// constants-----------------------------------------------------------------

const DATA_X              = "data-x";
const DATA_Y              = "data-y";
const NONE                = "none";
const LABEL               = "-label";
const MOTHERBOARD         = "motherboard";
const CPU_ON_MOTHERBOARD  = "cpu-on-motherboard";
const CASE                = "case";
const COOLER_ON_CPU       = "cooler-on-cpu";
const MOTHERBOARD_IN_CASE = "motherboard-in-case";
const GPU_IN_CASE         = "gpu-in-case";
const HDD_IN_CASE         = "hdd-in-case";

const DZ_ACCEPT_CPU                = "#cpu";
const DZ_ACCEPT_COOLER             = "#cooler";
const DZ_ACCEPT_RAM                = "#ram";
const DZ_ACCEPT_RAM_ON_MOTHERBOARD = "#ram-on-motherboard";
const DZ_ACCEPT_GPU                = "#gpu";
const DZ_ACCEPT_HDD                = "#hdd";

// global variables----------------------------------------------------------

let currentAccept   = DZ_ACCEPT_CPU;
let currentDropzone = MOTHERBOARD;

// functions-----------------------------------------------------------------

function dragMoveListener(pEvent) {
  var target   = pEvent.target;
  var dataName = target.getAttribute("data-name");
  var label    = document.getElementById(dataName + LABEL);

  label ? label.style.display = NONE : null;

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

function getDropzoneContent() {
  if (currentDropzone === MOTHERBOARD) {
    currentDropzone = CPU_ON_MOTHERBOARD;
    return `<svg class="z-40 dropzone text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline size-9/12" id="cpu-on-motherboard">
              <use href="/src/svg/cpu-on-motherboard.svg#cpu-on-motherboard"></use>
            </svg>`;
  } else if (currentDropzone === CPU_ON_MOTHERBOARD) {
    currentDropzone = COOLER_ON_CPU;
    return `<svg class ="z-40 dropzone text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline size-9/12" id="cooler-on-cpu">
              <use href="/src/svg/cooler-on-cpu.svg#cooler-on-cpu"></use>
            </svg>`;
  } else if (currentDropzone === COOLER_ON_CPU) {
    currentDropzone = CASE;
    return `<svg class="z-40 hover:cursor-grab drag-drop text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline size-9/12" id="ram-on-motherboard">
              <use href="/src/svg/ram-on-motherboard.svg#ram-on-motherboard"></use>
            </svg>`;
  } else if (currentDropzone === CASE) {
    currentDropzone = MOTHERBOARD_IN_CASE;
    return `<svg class="z-40 dropzone text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline scale-150" id="motherboard-in-case">
              <use href="/src/svg/motherboard-in-case.svg#motherboard-in-case"></use>
            </svg>`;
  } else if (currentDropzone === MOTHERBOARD_IN_CASE) {
    currentDropzone = GPU_IN_CASE;
    return `<svg class="z-40 dropzone text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline scale-150" id="gpu-in-case">
              <use href="/src/svg/gpu-in-case.svg#gpu-in-case"></use>
            </svg>`;
  } else if (currentDropzone === GPU_IN_CASE) {
    currentDropzone = HDD_IN_CASE;
    return `<svg class="z-40 dropzone text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline scale-150" id="hdd-in-case">
              <use href="/src/svg/hdd-in-case.svg#hdd-in-case"></use>
            </svg>`;
  }
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
            setDropzoneAccept(DZ_ACCEPT_CPU);
          } else if (currentDropzone === CPU_ON_MOTHERBOARD) {
            setDropzoneAccept(DZ_ACCEPT_COOLER);
          } else if (currentDropzone === COOLER_ON_CPU) {
            setDropzoneAccept(DZ_ACCEPT_RAM);
          } else if (currentDropzone === CASE) {
            setDropzoneAccept(DZ_ACCEPT_RAM_ON_MOTHERBOARD);
          } else if (currentDropzone === MOTHERBOARD_IN_CASE) {
            setDropzoneAccept(DZ_ACCEPT_GPU);
          } else if (currentDropzone === GPU_IN_CASE) {
            setDropzoneAccept(DZ_ACCEPT_HDD);
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
        // dropactivate(pEvent) {
        //   // pEvent.target.classList.add("drop-active");
        //   // console.log('dropactivate | pEvent.target: ', pEvent.target);
        // },
        dragenter(pEvent) {
          // var draggableElement = event.relatedTarget;
          // var dropzoneElement = event.target;

          //feedback the possibility of a drop
          // dropzoneElement.classList.add("drop-target");
          // draggableElement.classList.add("can-drop");
          // draggableElement.textContent = "Dragged in";
          console.log("dragged in");
        },
        dragleave(pEvent) {
          //remote the drop feedback style
          // event.target.classList.remove("drop-target");
          // event.relatedTarget.classList.remove("can-drop");
          // event.relatedTarget.textContent = "Dragged out";
          console.log("dragged out");
        },
        drop(pEvent) {
          const droppedIcon = pEvent.relatedTarget;
          const dropzone    = pEvent.target;
          const parentDiv   = dropzone.parentNode;

          var dropzoneId = dropzone.getAttribute("id");
          var label      = document.getElementById(dropzoneId + LABEL);

          droppedIcon.style.display   = NONE;
          dropzone.style.display      = NONE;
          label ? label.style.display = NONE : null;

          parentDiv.innerHTML = getDropzoneContent();
        },
        // dropdeactivate(pEvent) {
        //   //remove active dropzone feedback
        //   // pEvent.target.classList.remove("drop-active");
        //   // pEvent.target.classList.remove("drop-target");
        // },
      },
    });
});
