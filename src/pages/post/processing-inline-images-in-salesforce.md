---
layout: ../../layouts/post.astro
title: Processing Inline Images in Salesforce
dateFormatted: June 18 2024
wordCount: 590 words
readingTime: 4 min
description: How to post an inline image in Salesforce Chatter with LWCs and Apex
---
![Front end view of a posted inline image](/posts/processing-inline-images-in-salesforce/frontendViewOfInlineImagePost.png)

I have not found a good tutorial about how to pass in a user-uploaded image to the `<lightning-input-rich-text>` in the front-end and handle the image in Apex.

The [Salesforce documentation](https://developer.salesforce.com/docs/component-library/bundle/lightning-input-rich-text/documentation) has a bunch of good examples on where to start, but it did not completely satisfy my use case.

## HTML

```html
<template>
    <lightning-input-rich-text>
        placeholder="Share an update..."
        formats={formats}
        onchange={handleChange}
        value={myVal}
        variant="bottom-toolbar"
    </lightning-input-rich-text>
</template>
```

The `<lightning-input-rich-text>` element contains the `formats` attribute which allows you to pass in the rich text formats of your choosing.

Make sure you include `image` so that you can use Salesforce's built in functionality to add an inline image to the rich text.

The issue I faced when I was implementing this was how Salesforce processes the inline image in the HTML string. The image presents itself in the HTML string in the form `<img src="someLocalLinkWithAnImageRefId">`.

In the next section, you will see how we can utilize this link in JavaScript.

Simple enough so far.

## Lightning Web Component

The goal of our LWC is to process the inline image uploaded by the user in `<lightning-input-rich-text>` element and extract the image URL, reference ID and update the string to be usable by Apex.

```javascript
import { LightningElement } from 'lwc';
import postInlineImage from '@salesforce/apex/InlineImageService.postInlineImage'; //To be used later, bare with me

export default class InlineImageExample extends LightningElement {
    formats = ['font', 'size', 'bold', 'italic', 'underline', 'strike', 'image'];
    myVal   = '';

    //Helper function to extract relevant info in preparation for Apex call
    getImgInfo(htmlString) {
        const IMG_REGEX = /<img.*?src="(.*?refid=([^"&]+))".*?>/g; //regex extracts the image URL and reference ID

        let imgUrls   = [];
        let imgRefIds = [];
    
        //format string to prepare for Apex call
        let updatedHtmlString = htmlString.replace( 
            IMG_REGEX,
            (matchedSubstring, imgUrl, imgRefId) => {
                imgUrls.push(imgUrl);
                imgRefIds.push(imgRefId);
                return `{img:${imgRefId}}`;
            }
        );
    
        return {
            imgUrls: imgUrls,
            imgRefIds: imgRefIds,
            updatedHtmlString: updatedHtmlString
        }
    }
}
```

Using regex, you can extract the image's local URL and refId. In this tutorial, we'll only make use of the image's URL.

Now prepare a wrapper to call Apex with:

```javascript
createWrapperForApex() {
    let imgInfo               = this.getImgInfo(this.myVal);
    let htmlStringWithImgInfo = imgInfo.updatedHtmlString;

    let obj = new Object();
    obj.post = {
        htmlContent: htmlStringWithImgInfo,
        inlineImgUrls: imgInfo.imgUrls,
        inlineImgRefIds: imgInfo.imgRefIds
    };

    let inputWrapper      = new Object();
    inputWrapper.inputObj = JSON.stringify(obj);

    return inputWrapper;
}
```

## JavaScript call to Apex

Now pass the wrapper we created before to Apex. This function can be called by a button or something, but I'll leave that up to you.

```javascript
async sendToApex() {
    const inputWrapper = this.createWrapperForApex();

    try {
        const result = await postInlineImage({ inputWrapperJSON: inputWrapper.inputObj });
    } catch (error) {
        console.error('Error uploading images: ', error);
    }
}
```

## Apex

Okay, a bit of a longer code snippet coming up, but this is basically what's happening:

1. Deserialize the input wrapper
2. Extract all of the image URLs from the user input string
3. Create [Blobs](https://developer.salesforce.com/docs/atlas.en-us.apexref.meta/apexref/apex_methods_system_blob.htm) of the images using the image URL
4. Create and insert [Content Versions](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_contentversion.htm) of the images
5. Use the Content Versions as you wish in your Salesforce org

```apex
public class InlineImageService {

    // Wrapper class to deserialize the incoming JSON
    public class InputWrapper {
        public String inputObj { get; set; }
    }

    @AuraEnabled
    public static void postInlineImage(String inputWrapperJSON) {
        // Parse the JSON string into the InputWrapper class
        InputWrapper inputWrapper = (InputWrapper) JSON.deserialize(inputWrapperJSON, InputWrapper.class);
        
        // Holds multiple content versions of the potentially multiple inline images
        List<ContentVersion> contentVersions = new List<ContentVersion>();

        // Iterate over the reference IDs and URLs and prepare content versions for each image
        for (Integer i = 0; i < inputWrapper.inlineImgRefIds.size(); i++) {
            String imgRefId = inputWrapper.inlineImgRefIds[i];
            String imgUrl = inputWrapper.inlineImgUrls[i];

            PageReference page = new PageReference(imgUrl);
            Blob imgBlob = page.getContent();

            ContentVersion imgContentVersion = new ContentVersion();
            imgContentVersion.Title = imgRefId;
            imgContentVersion.VersionData = imgBlob;
            imgContentVersion.PathOnClient = '/' + imgRefId + '.jpeg';

            contentVersions.add(imgContentVersion);
        }

        // Insert content versions into the system
        insert contentVersions;

        // Collect the inserted ContentVersion IDs
        List<Id> contentVersionIds = new List<Id>();
        for (ContentVersion cv : contentVersions) {
            contentVersionIds.add(cv.Id);
        }

        // Query ContentVersion to get the ContentDocumentIDs
        List<ContentVersion> contentVersionsWithDocumentIds = [
            SELECT Title, ContentDocumentID
            FROM ContentVersion
            WHERE Id IN :contentVersionIds
        ];

        // Additional processing can be done here if needed
    }
}
```

Hope this helps, thanks for reading and happy coding!
