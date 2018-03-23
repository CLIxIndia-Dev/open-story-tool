# Open Story Tool

Open Story is an HTML5 application which allows you to build slideshows, incorporating audio, video, and text. HTTPS is required to use all of its features.   

Requires Chrome 49+

### File Types
Open Story uses three kinds of file types: cssw, csst, and cssv
#### cssw
A "w"orking file. All permissions are available to be locked or unlocked and content can be freely added.
#### csst
A "t"emplate file. Permissions are unable to be changed but content can be freely added.
#### cssv
a "v"ideo file. This kind of slideshow cannot be edited at all and is intended for viewing only.

### Query Parameters
#### Default Project
To have a default project load, pass a "file" parameter.  
`file=birds.csst`
#### Gallery
To have a non-default gallery load, pass a "gallery" parameter.  
`gallery=birds`
#### API
To change where data is logged to, you can pass it an "api" parameter.  
`api=/some/url/here`

The default is QBank's API located at `:8080/api/v1/logging/genericlog` and specifics regarding what specific data is collected can be found in the the Open Story Tool GitHub wiki. Data is sent as part of a payload with:

```
{
  data: {
    app_name: "OpenStory",
    session_id: "123",
    event_type: "slide_duped" // depends on the actual event
  }
}
```


### Embedding
Open Story can be embedded into an iframe, as outlined in the embedding document:  
Embedded Open Story Tool

Open Story can be embedded into an activity. When you do this, you can specify two things that are unique to that activity:
a starting slideshow file that is preloaded
a specified gallery of images
Where do I get the starting slideshow file?
This part is very easy. Just open any version of Open Story, create the slideshow that you want students to see when they start the activity, and save it. Then put that file in the correct activity folder in unplatform. It can be any type of slideshow file, .cssw, .csst, or .cssv.
How do I make a gallery?
All images that Open Story can access are stored in the OpenStoryTool/images folder.

Images in the top level of that folder populate the default gallery. That means that if you don’t specify any gallery within an activity’s html, the images in the default gallery will be available to the student in the gallery. So you might have a general set of images that students can access in that case, or you might keep it empty.

To define a gallery, create a subfolder in the OpenStoryTool/images folder. For example,you might create a folder called “birds”. The name of that folder is now the name of the gallery, which you must specify in the activity’s html. Put the images for this activity into the subfolder you created. These are the images that will populate this gallery. Make as many subfolders as you want, one for each Open Story activity. Students will only be able to access one gallery per activity.
How to embed the Open Story tool
To embed the Open Story tool into an activity, create a blank activity page and embed the following code. This will launch the Open Story tool with a blank slideshow and access to the default gallery.

<iframe src="/modules/OpenStoryTool/index.html" style="width:860px; height:600px" frameBorder="0"></iframe>

To specify a starting slideshow and/or a specific gallery, you need to provide the information to the Open Story tool’s code.

<iframe src="/modules/OpenStoryTool/index.html?gallery=birds&file=birds.csst" style="width:860px; height:600px" frameBorder="0"></iframe>

From this example, replace birds.csst with the name of the starting slideshow you want to use.
That starting file must be in the same folder as the index.html file. If you don’t include the file parameter, Open Story will start with a blank slideshow by default.

From this example, replace birds (the name of the gallery) with the name of the gallery you want to be available to the students. This must be a gallery that exists in the OpenStoryTool/images folder. If you don’t include the gallery parameter, Open Story will use the default gallery.

Please see the Open Story Tool GitHub wiki for more information.


# Third-party Licenses and Copyright
Please check `NOTICES.md` for more detailed information about third-party libraries and their licenses.

## Image Copyrights
All images located in the `/images` directory are in the public domain and sourced from https://www.publicdomainpictures.net.
