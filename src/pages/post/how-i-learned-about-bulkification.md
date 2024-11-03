---
layout: ../../layouts/post.astro
title: How I Learned About Bulkification
dateFormatted: October 16 2024
wordCount: 256 words
readingTime: 1 min
description: Don't grab 1 plate at a time when you can grab all 100
---
## Introduction

My boss once said to me

> If I asked you to get me 100 plates from the kitchen, would you:
>
> * Go to the kitchen, grab 1 plate and repeat 100 times
> * Go to the kitchen and grab 100 plates

It stuck with me ever since.

I learned about Bulkification in a Salesforce context, where we don't set our own governor limits. What this means is we can only use Apex and SOQL to retrieve records under a certain amount, and if we go over that amount we have to pay extra.

## Grabbing 1 plate at a time

Here's an example of what I used to do:

```apex
public class Kitchen {
    public void grabPlates(List<String> plates) {
        for (String plateName : plates) {
            // Grab 1 plate at a time
            Plate plate = [SELECT Name, Status FROM Plate WHERE Name = :plateName LIMIT 1];
            plate.Status = 'Grabbed';
            
            //Give 1 plate at a time
            give plate;
        }
    }
}
```

Now my boss had an issue with this because it's not efficient, why grab one plate at a time when you can grab all 100?

## Grabbing all 100 plates at once

Here's the better way of doing it:

```apex
public class Kitchen {
    public void grabPlates(List<String> plates) {
        // Get ready to grab all the plates
        List<Plate> platesToGrab = [SELECT Name, Status FROM Plate WHERE Name IN :plates];
        
        // Grab all the plates
        for (Plate plate : plates) {
            plate.Status = 'Grabbed';
        }
        
        // Give all the plates
        give platesToGrab;
    }
}  
```

And that's why Bulkification is better.
