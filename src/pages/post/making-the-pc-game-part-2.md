---
layout: ../../layouts/post.astro
title: Making the PC Game - Part 2
dateFormatted: November 10 2024
wordCount: 1,124 words
readingTime: 6 min
description: The technical details of the PC game
---

## Implementation

Here is where the horror story begins - consider yourself warned but I completely made all the architectural decisions myself while building this game out. It wasn't until [my brother](https://www.linkedin.com/in/eyad-elkhodary/) started helping with minor fixes that he looked at my code and went :O...

So the general technical idea behind the PC component is as follows:

1. All individual parts, combined parts and labels are SVGs
2. All drag and drop features were built using [interact.js](https://interactjs.io/)
3. Some parts are *draggables* and one part is a *dropzone* at a time
4. When you drag a draggable part, its label's visibility is set to hidden
5. The motherboard part is set to be the first dropzone
6. When you successfully drag a draggable part and drop on the correct dropzone, the following occurs:
   1. Replace the dropzone part with a new combined part
   2. Set the dropzone to new component
7. Repeat till you drag and drop all the components successfully

The relevant folder structure:

- ```index.astro``` the homepage contains all the PC parts with ```Icon``` components
  - I intially organized the original PC parts into ```Icon``` components in order to process the SVG and be able to pass in separate CSS variables for the PC parts and their labels - but my brother complained about how I'm doing this because - why wouldn't I just set the CSS myself? Or as you will see later, why am I making these original PC parts into ```Icon``` components and not the combined ones?
- ```drag.js``` contains all the logic for dragging and dropping, switching dropzones, and dropping the labels
- All svgs live in a single ```/svg``` folder
- ```content.js``` which holds the SVG HTML content of all the combined PC parts

### Icon Component

My ```icon.astro``` component was mostly inspired by [this article](https://ellodave.dev/blog/article/using-svgs-as-astro-components-and-inline-css/) as you can see below:

```astro
---
import { parse } from 'node-html-parser';

export interface Props {
    pParent?: string;
    pPart: string;
    pPartClass?: string;
    pLabel?: string;
    pLabelClass?: string;
}

function getSVG(name: string) {
    const filepath = `/public/svg/${name}.svg`;
    const files = import.meta.glob<string>('/public/svg/**/*.svg', {query: '?raw', import: 'default', eager: true});

    if (!(filepath in files)) {
        throw new Error (`${filepath} not found`);
    }

    const root = parse(files[filepath]);
    const svg = root.querySelector('svg');

    if (!svg) {
        throw new Error(`<svg> element not found in ${filepath}`);
    }
    
    const { attributes, innerHTML } = svg;

    return { attributes, innerHTML };
}

const { pParent, pLabel, pLabelClass, pPart, pPartClass } = Astro.props as Props;

let labelAttributes = {};
let labelHTML = {};

if (pLabel) {
    const { attributes: labelDefAttributes, innerHTML: labelContent } = getSVG(pLabel);
    labelAttributes = { 
        ...labelDefAttributes, 
        class:  `${labelDefAttributes.class || ''} ${pLabelClass || ''}`.trim()
    };
    labelHTML = labelContent;
}

const { attributes: partDefAttributes, innerHTML: partHTML } = getSVG(pPart);

const partAttributes = {
    ...partDefAttributes,
    id: pPart,
    class: `${partDefAttributes.class || ''} ${pPartClass || ''}`.trim()
}
---

{pLabel ? (
    <div class={pParent}>
        <svg {...labelAttributes} set:html={labelHTML}></svg>
        <svg {...partAttributes} set:html={partHTML}></svg>
    </div>
) : (
    <svg {...partAttributes} set:html={partHTML}></svg>
)}
```

Again, I'm still not sure of this decision. But all I used this component for was to be able to process the original PC part SVGs and be able to pass in separate CSS variables to the labels and PC parts. Maybe I could have just done with using CSS normally instead but oh well...

### Drag and Drop JavaScript

Most of the magic was in ```drag.js``` below, firstly with how dragging the object functions:

```javascript
import interact from "interactjs";
import { instructions, svgElements } from "./content";

// functions-----------------------------------------------------------------

function dragMoveListener(pEvent) {
  var target = pEvent.target;
  var dataName = target.getAttribute("data-name");
  var label = document.getElementById(dataName + LABEL);

  label ? (label.style.display = NONE) : null;

  var x = (parseFloat(target.getAttribute(DATA_X)) || 0) + pEvent.dx;
  var y = (parseFloat(target.getAttribute(DATA_Y)) || 0) + pEvent.dy;

  target.style.transform = `translate(${x}px, ${y}px)`;

  target.setAttribute(DATA_X, x);
  target.setAttribute(DATA_Y, y);

  target.style.cursor = "grabbing";
}
```

Updating the dropzone content, everytime you drag and drop a PC part successfully. I'm not posting the whole code snippet for brevity but the general gist of this part is that everytime a PC part is successfully dropped, the current dropzone gets replaced, as well as the text instruction displayed to the user, and the combined PC part is returned.

```javascript
function getDropzoneContent() {
  const instruction = document.getElementById("instruction");

  switch (currentDropzone) {
    case MOTHERBOARD:
      currentDropzone         = CPU_ON_MOTHERBOARD;
      instruction.textContent = instructions.ADD_COOLER;
      return svgElements.CPU_ON_MOTHERBOARD;

    case COOLER_ON_CPU:
      currentDropzone         = CASE;
      instruction.textContent = instructions.ADD_MOTHERBOARD_TO_CASE;

      const caseElement = document.querySelector(DZ_ACCEPT_CASE);
      caseElement && !caseElement.classList.contains(DROPZONE)
        ? caseElement.classList.add(DROPZONE)
        : null;

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
```

Setting what the dropzone accepts to a new PC part by utilizing ```interact.js```. The dropped PC parts are set to hidden, call ```getDropzoneContent()``` to update the PC part.

```javascript
window.addEventListener("load", () => {
  interact(".drag-drop")
    .styleCursor(false)
    .draggable({
      listeners: {
        start(pEvent) {
          switch (currentDropzone) {
            case MOTHERBOARD:
              setDropzoneAccept(DZ_ACCEPT_CPU);
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
        drop(pEvent) {
          const droppedIcon = pEvent.relatedTarget;
          const dropzone    = pEvent.target;
          const parentDiv   = dropzone.parentNode;

          var dropzoneId = dropzone.getAttribute("id");
          var label      = document.getElementById(dropzoneId + LABEL);

          droppedIcon.style.visibility = HIDDEN;
          dropzone.style.display       = NONE;
          label ? (label.style.display = NONE) : null;

          parentDiv.innerHTML = getDropzoneContent();

          if (dropzoneId === HDD_IN_CASE) {
            setTimeout(() => {
              const monitorOff           = document.getElementById(MONITOR_OFF);
              monitorOff.style.visiblity = HIDDEN;
              monitorOff.innerHTML       = svgElements.MONITOR_ON;
              monitorOff.style.visiblity = VISIBLE;
            }, 1000); 
          }
        },
      },
    });
});
```

An example of one of the icons on the homepage, where you can see example of the CSS I wanted to pass in:

```astro
<Icon 
pParent="flex justify-center items-center col-span-1"
pLabel="motherboard-label" 
pLabelClass="absolute font-futuraMedium text-xs xl:text-base 2xl:text-sm text-rock dark:text-gasoline fill-current size-3/12 xl:size-[18%] 2xl:size-3/12 select-none"
pPart="motherboard"
pPartClass="z-40 dropzone text-rock dark:text-gasoline fill-current size-8/12 xl:size-6/12 2xl:size-9/12" 
/>
```

### Retrieving Instructions & Combined PC Parts

Finally, an example of what's in ```content.js``` just showing how I did not make use of the same ```icon.astro``` component *for some reason*:

```javascript
export const instructions = {
  CONGRATS: "Congratulations! You just built your first PC!",
};

export const svgElements = {
  CPU_ON_MOTHERBOARD: `
        <svg class="z-30 dropzone text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline size-8/12 md:size-7/12 xl:size-6/12 2xl:size-9/12" id="cpu-on-motherboard">
            <use href="/svg/cpu-on-motherboard.svg#cpu-on-motherboard"></use>
        </svg>`,
```

## Issues I've Faced

![My GitHub contribution history from June to October](/posts/making-the-pc-game-part-2/github-history.jpg)

When I started *coding with purpose* back in June, you can see most of [my contributions](https://github.com/MarwanElKhodary) related to this website have been in June and October. I can confidently tell you that at least 70% of my contributions have been made in regards to the PC game. This is primarily due to the issues I encountered like:

- SVG sizing issues when replacing the individual PC parts with combined PC parts
- CSS-related issues with the PC parts from Yasemin's exported SVGs to what it looked like locally
- Trying to make the PC parts responsive on laptops, monitors and smartphones
  - You can still see some of these issues currently on the website, especially on smartphones and tablets :(

## Learnings

- I need to look more into how SVG works, primarily with why I faced so many issues with removing CSS from Adobe Illustrator-exported SVGs
- I've never thought of myself as a perfectionist till I started working on this website, I need to learn on how to ship faster
- Spend more time thinking about architectural decisions, I think building this game could have been much more efficient and faster had I discussed my technical details with another developer
- There was a large number of iterations between design and implementation, factor this when building a somewhat-complex program
