---
layout: ../../layouts/post.astro
title: Making the PC Game - Part 1
dateFormatted: November 3 2024
wordCount: 690 words
readingTime: 4 min
description: The inspiration and design of the PC game
---

## Inspiration

When I started planning my personal website, I sought out inspiration that would guide my design process. I knew that ultimately, this blog would be an excuse for me to write more on [LinkedIn](https://www.linkedin.com/in/marwan-elkhodary/), but I wanted to add a *me* element to it.

I went through [HackerNews](https://news.ycombinator.com/) daily and started noting blogs that had cool designs. My list ranged from beautiful and overly ambitious websites such as [Alistar Shepard's with his sleek scroll animation and charming scenery](https://alistairshepherd.uk/) or [Jacob Leech's design and creativity](https://jacobleech.com/):

<div style="display: flex; justify-content: center;">
  <img src="/posts/making-the-pc-game/jacob-leech-website.gif" alt="Jacob Leech's amazing design" />
</div>

While I pride myself as a full-stack developer, I knew I didn't have the chops to call myself a front-end developer... I still have tons to learn about crafting and designing beautiful, engaging websites. So I ended up focusing on trying to add 1 component to my website that would make it stand out.

More inspiration consisted of cool components like [Chris Kirk-Nielsen's hilarious random fact generator](https://chriskirknielsen.com/), [Wells Riley's raining hamburgers](https://wells.ee/), or [Monica Dinculescu's regenerating art](https://meowni.ca/):

<div style="display: flex; justify-content: center;">
  <img src="/posts/making-the-pc-game/monica-dinculescu-art.gif" alt="Monica Dinculescu's cool art" />
</div>

Now that you have a good idea of where I was coming from, let's move on to how we started designing the PC component.

## Design

After gathering inspiration, I collaborated with graphic and web designer [Yasemin](https://www.linkedin.com/in/yasemin-axi-basoglu/) to brainstorm what we can do. At this point I was a lot more worried about my capabilities in bringing her vision to life. She started by walking me through her moodboard of options, I actually still have the Figma file below:

![Figma moodboard of various components we were considering in designing](/posts/making-the-pc-game/figma-moodboard.jpg)

As you might have guessed, we ended up going with the first option. While all the designs and ideas were cool, the biggest factor was the belief in myself in being able to implement it. As soon as I saw description of the pc component, I immediately thought to myself *"Well, we can just have a SVG of every PC part, and when the user drags and drop the part it would just replace the SVG with another"*. More on the technical details of this in Part 2.

For our MVP to launch, we were discussing the limit of the game, such as giving the user many options to build the PC in different ways, but we ended up on just one happy path with the potential of including every order of paths to take sometime in the future.

You can even see, very early on in our design process, Yasemin had planned what the homepage would look like:

![Yasemin's storyboard of the homepage](/posts/making-the-pc-game/homepage-storyboard.jpg)

I **literally** could not have done this without a web designer. I highly recommend every developer to have a designer close by, even for seemingly simple projects like this, it makes a world of a difference in allowing you to focus on coding and not worry about the design decision-making.

As for the actual specifics of her design process, she hand-drew all of the PC parts on her iPad, imported them to Adobe Illustrator and then shared the SVG files with me through Google Drive. This meant she had to hand-draw 17 components of individual and combined PC parts, as well as all their labels.

## Final Thoughts

- Overcoming stressors and imposter syndrome is a constant while developing. There were many points while developing this component where I was extremely stuck but I had to push through because there's always a solution out there.
- In the future, when I have a more well-rounded repertoire as a developer, I would like to work on a barebones website similar to [David Winer's](https://davewiner.com/)
- I am extremely proud and happy with how my first personal website ended up turning out
- Be humble. It is impressive to me how developers can work on **multiple** personal projects on top of their full time jobs, as well as juggle sleep, social life and excercise

If you've made it this far, thank you so much for reading!
