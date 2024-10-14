import interact from "interactjs";

// constants-----------------------------------------------------------------

const DATA_X   = "data-x";
const DATA_Y   = "data-y";
const NONE     = "none";
const LABEL    = "-label";
const DROPZONE = 'dropzone';         

const MOTHERBOARD   = "motherboard";
const CASE          = "case";
const COOLER_ON_CPU = "cooler-on-cpu";
const GPU_IN_CASE   = "gpu-in-case";
const HDD_IN_CASE   = "hdd-in-case";
const MONITOR_OFF   = "monitor-off";
const CPU_ON_MOTHERBOARD  = "cpu-on-motherboard";
const MOTHERBOARD_IN_CASE = "motherboard-in-case";

const DZ_ACCEPT_CPU    = "#cpu";
const DZ_ACCEPT_CASE   = "#case";
const DZ_ACCEPT_COOLER = "#cooler";
const DZ_ACCEPT_RAM    = "#ram";
const DZ_ACCEPT_GPU    = "#gpu";
const DZ_ACCEPT_HDD    = "#hdd";
const DZ_ACCEPT_PSU    = "#psu";
const DZ_ACCEPT_RAM_ON_MOTHERBOARD = "#ram-on-motherboard";

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
  const instruction = document.getElementById('instruction');

  if (currentDropzone === MOTHERBOARD) {
    currentDropzone         = CPU_ON_MOTHERBOARD;
    instruction.textContent = 'Great! Now you can add the Cooler on top of the CPU in the Motherboard';
    return `<svg class="z-40 dropzone text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline size-9/12" id="cpu-on-motherboard">
              <use href="/svg/cpu-on-motherboard.svg#cpu-on-motherboard"></use>
            </svg>`;
  } else if (currentDropzone === CPU_ON_MOTHERBOARD) {
    currentDropzone         = COOLER_ON_CPU;
    instruction.textContent = 'Last thing for the Motherboard is to add the RAM';
    return `<svg class ="z-40 dropzone text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline size-9/12" id="cooler-on-cpu">
              <use href="/svg/cooler-on-cpu.svg#cooler-on-cpu"></use>
            </svg>`;
  } else if (currentDropzone === COOLER_ON_CPU) {
    currentDropzone         = CASE;
    instruction.textContent = 'Now you can insert the Motherboard in the Case!';

    const caseElement = document.querySelector(DZ_ACCEPT_CASE);
    caseElement && !caseElement.classList.contains(DROPZONE) ? caseElement.classList.add(DROPZONE) : null;

    return `<svg class="z-40 hover:cursor-grab drag-drop text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline size-9/12" id="ram-on-motherboard">
              <use href="/svg/ram-on-motherboard.svg#ram-on-motherboard"></use>
            </svg>`;
  } else if (currentDropzone === CASE) {
    currentDropzone         = MOTHERBOARD_IN_CASE;
    instruction.textContent = 'Now we can start building in the case. Insert the GPU underneath the Motherboard';
    return `<svg class="z-40 dropzone text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline scale-150" id="motherboard-in-case">
              <use href="/svg/motherboard-in-case.svg#motherboard-in-case"></use>
            </svg>`;
  } else if (currentDropzone === MOTHERBOARD_IN_CASE) {
    currentDropzone         = GPU_IN_CASE;
    instruction.textContent = 'Hard Drive next.'
    return `<svg class="z-40 dropzone text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline scale-150" id="gpu-in-case">
              <use href="/svg/gpu-in-case.svg#gpu-in-case"></use>
            </svg>`;
  } else if (currentDropzone === GPU_IN_CASE) {
    currentDropzone = HDD_IN_CASE;
    instruction.textContent = 'Last step! Fit the Power Supply in the Case so we can turn the PC on!';
    return `<svg class="z-40 dropzone text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline scale-150" id="hdd-in-case">
              <use href="/svg/hdd-in-case.svg#hdd-in-case"></use>
            </svg>`;
  } else if (currentDropzone === HDD_IN_CASE) {
    instruction.textContent = 'Congratulations! You just built your first PC!';
    return `<svg class="z-40 text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline scale-150" id="psu-in-case">
              <use href="/svg/psu-in-case.svg#psu-in-case"></use>
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
          switch (currentDropzone) {
            case MOTHERBOARD:
              setDropzoneAccept(DZ_ACCEPT_CPU);
              break;
            case CPU_ON_MOTHERBOARD:
              setDropzoneAccept(DZ_ACCEPT_COOLER);
              break;
            case COOLER_ON_CPU:
              setDropzoneAccept(DZ_ACCEPT_RAM);
              break;
            case CASE:
              setDropzoneAccept(DZ_ACCEPT_RAM_ON_MOTHERBOARD);
              break;
            case MOTHERBOARD_IN_CASE:
              setDropzoneAccept(DZ_ACCEPT_GPU);
              break;
            case GPU_IN_CASE:
              setDropzoneAccept(DZ_ACCEPT_HDD);
              break;
            case HDD_IN_CASE:
              setDropzoneAccept(DZ_ACCEPT_PSU);
              break;
            default:
              break;
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
          // console.log("dragged in");
        },
        dragleave(pEvent) {
          //remote the drop feedback style
          // event.target.classList.remove("drop-target");
          // event.relatedTarget.classList.remove("can-drop");
          // event.relatedTarget.textContent = "Dragged out";
          // console.log("dragged out");
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

          if (dropzoneId === HDD_IN_CASE) {
            setTimeout(() => {
              const monitorOff = document.getElementById(MONITOR_OFF);
              const monitorOn = `<svg class="place-self-center text-rock dark:text-gasoline fill-current size-7/12 xl:size-full" id="monitor-on">
                                  <use href="/svg/monitor-on.svg#monitor-on"></use>
                                </svg>`;
              
              monitorOff.outerHTML = monitorOn;
            }, 1000);
          }

        },
        // dropdeactivate(pEvent) {
        //   //remove active dropzone feedback
        //   // pEvent.target.classList.remove("drop-active");
        //   // pEvent.target.classList.remove("drop-target");
        // },
      },
    });
});
