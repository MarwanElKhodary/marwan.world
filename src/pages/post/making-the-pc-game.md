---
layout: ../../layouts/post.astro
title: Making the PC game
dateFormatted: 30 October 2024
wordCount: 368 words
readingTime: 2 min
description: How and why I built this website
---

## Inspiration

When I started planning my blogs, I sought out inspiration that would guide my design process. I knew that ultimately, this blog would be an excuse for me to write more on [LinkedIn](https://www.linkedin.com/in/marwan-elkhodary/), but I wanted to add a *me* element to it.

I went through [HackerNews](https://news.ycombinator.com/) daily and started noting blogs that had cool designs. My list ranged from beautiful and overly ambitious websites such as [Alistar Shepard's](https://alistairshepherd.uk/) with his sleek scroll animation and beautiful scenery:

<div style="display: flex; justify-content: center;">
  <img src="/posts/making-the-pc-game/alistair-shepherd-website.gif" alt="Alistair Shepherd's cool scroll animation on his website" />
</div>

Or [Jacob Leech's](https://jacobleech.com/) design and creativity:

<div style="display: flex; justify-content: center;">
  <img src="/posts/making-the-pc-game/jacob-leech-website.gif" alt="Jacob Leech's amazing design" />
</div>

While I pride myself as a full-stack developer, I knew I didn't have the chops to call myself a front-end developer... I still have tons to learn about crafting and designing beautiful, engaging websites. So I ended up focusing on trying to add 1 component to my website that would make it stand out.

More inspiration consisted of cool components like [Monica Dinculescu's](https://meowni.ca/) regenerating art:

<div style="display: flex; justify-content: center;">
  <img src="/posts/making-the-pc-game/monica-dinculescu-art.gif" alt="Monica Dinculescu's cool art" />
</div>

Or [Chris Kirk-Nielsen's](https://chriskirknielsen.com/) hilarious random fact generator:

<div style="display: flex; justify-content: center;">
  <img src="/posts/making-the-pc-game/chris-random-fact-generator.gif" alt="Chris' hilarious random fact generator" />
</div>

Or [Wells Riley's](https://wells.ee/) raining hamburgers:

<div style="display: flex; justify-content: center;">
  <img src="/posts/making-the-pc-game/wells-burgers.gif" alt="Wells' raining hamburgers" />
</div>

Now that you have a good idea of where I was coming from, let's move on to how we started designing the PC component.

## Design

First thing I did, after making a list of inspirational blogs, was meet up with [Yasemin](https://www.linkedin.com/in/yasemin-axi-basoglu/) to brainstorm what we can do. Now, Yasemin is an unbelievable talented painter, designer and artist; so I was a lot more worried about my capabilities in carrying out her vision. She started by walking me through her moodboard of options, I actually still have the Figma file below:

![Figma moodboard of various components we were considering in designing](/posts/making-the-pc-game/figma-moodboard.jpg)

As you might have guessed, we ended up going with the first option. While all the designs and ideas were cool, the biggest factor was the belief in myself in being able to implement it. As soon as I saw description of th pc component, I immediately thought to myself *"Well, we can just have a SVG of every PC part, and when the user drags and drop the part it would just replace the SVG with another"*. More on this specific piece later.

While designing we were discussing the limit of the game, such as giving the user many options to build the PC in different ways, but we ended up on just one happy path. Mainly to make it easier for myself and Yasemin.

You can even see, very early on in our design process, Yasemin had planned what the homepage would look like:

![Yasemin's storyboard of the homepage](/posts/making-the-pc-game/homepage-storyboard.jpg)

I'll touch up on this more in the Final Thoughts section later, but I **literally** could not have done this without Yasemin. I highly recommend every developer to have a designer close by, even for seemingly simple projects like this, it makes a world of a difference in allowing you to focus on coding and not worry about the design decision-making.

As for the actual specifics of her design process, you would have to ask her, but from what I recall she hand-drew all of the PC parts on her iPad, imported them to Adobe Illustrator and then shared the SVG files with me through Google Drive. This meant she had to hand-draw 17 components of individual and combined PC parts, as well as all their labels.

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
  - I intiially organized the original PC parts into ```Icon``` components in order to process the SVG and be able to pass in separate CSS variables for the PC parts and their labels - but my brother complained about how I'm doing this because - why wouldn't I just set the CSS myself? Or as you will see later, why am I making these original PC parts into ```Icon``` components and not the combined ones?
- ```drag.js``` contains all the logic for dragging and dropping, switching dropzones, and dropping the labels
- All svgs live in a single ```/svg``` folder
- ```content.js``` which holds the SVG HTML content of all the combined PC parts

My ```icon.astro``` component was partially inspired by [this article](https://ellodave.dev/blog/article/using-svgs-as-astro-components-and-inline-css/) as you can see below:

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

Updating the dropzone content, everytime you drag and drop a PC part successfully:

```javascript
function getDropzoneContent() {
  const instruction = document.getElementById("instruction");

  switch (currentDropzone) {
    case MOTHERBOARD:
      currentDropzone         = CPU_ON_MOTHERBOARD;
      instruction.textContent = instructions.ADD_COOLER;
      return svgElements.CPU_ON_MOTHERBOARD;

    case CPU_ON_MOTHERBOARD:
      currentDropzone         = COOLER_ON_CPU;
      instruction.textContent = instructions.ADD_RAM;
      return svgElements.COOLER_ON_CPU;

    case COOLER_ON_CPU:
      currentDropzone         = CASE;
      instruction.textContent = instructions.ADD_MOTHERBOARD_TO_CASE;

      const caseElement = document.querySelector(DZ_ACCEPT_CASE);
      caseElement && !caseElement.classList.contains(DROPZONE)
        ? caseElement.classList.add(DROPZONE)
        : null;

      return svgElements.RAM_ON_MOTHERBOARD;

    case CASE:
      currentDropzone         = MOTHERBOARD_IN_CASE;
      instruction.textContent = instructions.ADD_GPU;
      return svgElements.MOTHERBOARD_IN_CASE;

    case MOTHERBOARD_IN_CASE:
      currentDropzone         = GPU_IN_CASE;
      instruction.textContent = instructions.ADD_HDD;
      return svgElements.GPU_IN_CASE;

    case GPU_IN_CASE:
      currentDropzone         = HDD_IN_CASE;
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
```

Setting what the dropzone accepts to a new PC part:

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

Finally, an example of what's in ```content.js``` just showing how I did not make use of the same ```icon.astro``` component *for some reason*:

```javascript
export const instructions = {
  CONGRATS:                "Congratulations! You just built your first PC!",
};

export const svgElements = {
  CPU_ON_MOTHERBOARD: `
        <svg class="z-30 dropzone text-rock dark:text-gasoline fill-none stroke-3 stroke-rock dark:stroke-gasoline size-8/12 md:size-7/12 xl:size-6/12 2xl:size-9/12" id="cpu-on-motherboard">
            <use href="/svg/cpu-on-motherboard.svg#cpu-on-motherboard"></use>
        </svg>`,
```

## Issues

## Learnings

## Final Thoughts
