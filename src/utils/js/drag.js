import interact from "interactjs";
import { instructions, svgElements } from "./content";

// constants-----------------------------------------------------------------

const DATA_X = "data-x";
const DATA_Y = "data-y";
const NONE = "none";
const LABEL = "-label";
const DROPZONE = "dropzone";

const MOTHERBOARD = "motherboard";
const CASE = "case";
const COOLER_ON_CPU = "cooler-on-cpu";
const GPU_IN_CASE = "gpu-in-case";
const HDD_IN_CASE = "hdd-in-case";
const MONITOR_OFF = "monitor-off";
const CPU_ON_MOTHERBOARD = "cpu-on-motherboard";
const MOTHERBOARD_IN_CASE = "motherboard-in-case";

const DZ_ACCEPT_CPU = "#cpu";
const DZ_ACCEPT_CASE = "#case";
const DZ_ACCEPT_COOLER = "#cooler";
const DZ_ACCEPT_RAM = "#ram";
const DZ_ACCEPT_GPU = "#gpu";
const DZ_ACCEPT_HDD = "#hdd";
const DZ_ACCEPT_PSU = "#psu";
const DZ_ACCEPT_RAM_ON_MOTHERBOARD = "#ram-on-motherboard";

// global variables----------------------------------------------------------

let currentAccept = DZ_ACCEPT_CPU;
let currentDropzone = MOTHERBOARD;

// functions-----------------------------------------------------------------

function dragMoveListener(pEvent) {
  var target = pEvent.target;
  var dataName = target.getAttribute("data-name");
  var label = document.getElementById(dataName + LABEL);

  label ? (label.style.display = NONE) : null;

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
  const instruction = document.getElementById("instruction");

  switch (currentDropzone) {
    case MOTHERBOARD:
      currentDropzone = CPU_ON_MOTHERBOARD;
      instruction.textContent = instructions.ADD_COOLER;
      return svgElements.CPU_ON_MOTHERBOARD;

    case CPU_ON_MOTHERBOARD:
      currentDropzone = COOLER_ON_CPU;
      instruction.textContent = instructions.ADD_RAM;
      return svgElements.COOLER_ON_CPU;

    case COOLER_ON_CPU:
      currentDropzone = CASE;
      instruction.textContent = instructions.ADD_MOTHERBOARD_TO_CASE;

      const caseElement = document.querySelector(DZ_ACCEPT_CASE);
      caseElement && !caseElement.classList.contains(DROPZONE)
        ? caseElement.classList.add(DROPZONE)
        : null;

      return svgElements.RAM_ON_MOTHERBOARD;

    case CASE:
      currentDropzone = MOTHERBOARD_IN_CASE;
      instruction.textContent = instructions.ADD_GPU;
      return svgElements.MOTHERBOARD_IN_CASE;

    case MOTHERBOARD_IN_CASE:
      currentDropzone = GPU_IN_CASE;
      instruction.textContent = instructions.ADD_HDD;
      return svgElements.GPU_IN_CASE;

    case GPU_IN_CASE:
      currentDropzone = HDD_IN_CASE;
      instruction.textContent = instructions.ADD_PSU;
      return svgElements.HDD_IN_CASE;

    case HDD_IN_CASE:
      instruction.textContent = instructions.CONGRATS;
      return svgElements.PSU_IN_CASE;

    default:
      return;
  }
}

function setDropzoneAccept(pNewAccept) {
  currentAccept = pNewAccept;
  interact(".dropzone").dropzone({
    accept: currentAccept,
    overlap: 0.2,
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
          const dropzone = pEvent.target;
          const parentDiv = dropzone.parentNode;

          var dropzoneId = dropzone.getAttribute("id");
          var label = document.getElementById(dropzoneId + LABEL);

          droppedIcon.style.visibility = "hidden";
          dropzone.style.display = NONE;
          label ? (label.style.display = NONE) : null;

          parentDiv.innerHTML = getDropzoneContent();

          if (dropzoneId === HDD_IN_CASE) {
            setTimeout(() => {
              const monitorOff = document.getElementById(MONITOR_OFF);
              const monitorOn = svgElements.MONITOR_ON;

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
