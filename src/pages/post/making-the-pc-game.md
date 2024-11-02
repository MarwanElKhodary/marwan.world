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

## Issues

## Learnings

## Final Thoughts
