---
layout: ../../layouts/post.astro
title: processing inline images in Salesforce
dateFormatted: 18 June 2024
wordCount: 590 words
readingTime: 4 min
---
![Front end view of a posted inline image](/assets/images/posts/frontendViewOfInlineImagePost.png)

There aren't a lot of great tutorials about how the `<lightning-input-rich-text>` element takes an user-uploaded inline image and how to handle the image in Apex such that you can use the image. 

## Prerequisites

Before we start, ensure you have:

- A Salesforce Developer Edition or Sandbox org
- Basic understanding of LWC and Apex
- Proper permissions to create and deploy Apex classes and LWC components

## HTML Template (chatterPost.html)

```html
<lightning-input-rich-text>
    placeholder="Share an update..."
    variant="bottom-toolbar"
    formats={richTextFormats}
    onchange={handleEditorChange}
    value={postContent}
</lightning-input-rich-text>
```

The `<lightning-input-rich-text>` element contains the `formats` attribute which allows you to pass in the rich text formats of your choosing.

Make sure you include `image` so that you can use Salesforce's built in functionality to add an inline image to the rich text.

The issue I faced when I was implementing this was how Salesforce processes the inline image in the HTML string. The image presents itself in the HTML string in the form `<img src="someLocalLinkWithAnImageRefId">`.

In the next section, you will see how we can utilize this link in JavaScript.

Simple enough so far.

## Lightning Web Component (chatterPost.js)

```javascript
postContent = ''; //updated by <lightning-input-rich-text>

getImgInfo(htmlString) {
    const IMG_REGEX = /<img.*?src="(.*?refid=([^"&]+))".*?>/g;

    let imgUrls = [];
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
    };
}
```

Using regex, you can extract the image's local URL and refId. In this tutorial, we'll only make use of the image's URL.

Now prepare a wrapper to call Apex:

```javascript
createPostFeedElementWrapper() {
    let imgInfo = this.getImgInfo(this.postContent);
    let htmlStringWithImgInfo = imgInfo.updatedHtmlString;

    let postFeedWrapper = new Object();
    postFeedWrapper.post = {
        htmlContent: htmlStringWithImgInfo,
        inlineImgUrls: imgInfo.imgUrls,
        inlineImgRefIds: imgInfo.imgRefIds
    };

    let inputWrapper = new Object();
    inputWrapper.inputObj = JSON.stringify(postFeedWrapper);

    return inputWrapper;
}
```

## JavaScript call to Apex

I'm going to omit this part of the tutorial *(sorry I need more content)* as the main focus is processing the inline image.

But yeah, send that input wrapper to Apex.

## Apex (callThisFileWhateverYouWant.cls)

```apex

public class InputWrapper {
    public String inputObj { get; set; }
}

@AuraEnabled
public static void postInlineImage(String inputWrapperJSON) {
    // Parse the JSON string into Apex class
    InputWrapper inputWrapper = (InputWrapper) JSON.deserialize(inputWrapperJSON, InputWrapper.class);
    //Holds multiple content versions of the potentially multiple inline images
    List<ContentVersion> contentVersions = new List<ContentVersion>();

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

    insert contentVersions;

    List<Id> contentVersionIds = new List<Id>();
    for (ContentVersion cv : contentVersions) {
        contentVersionIds.add(cv.Id);
    }

    List<ContentVersion> contentVersionsWithDocumentIds = [
        SELECT Title, ContentDocumentID
        FROM ContentVersion
        WHERE Id 
        IN : contentVersionIds
    ];



}
```
