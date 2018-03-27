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

### Configurations
OpenStoryTool has four settings to configure:

* Project to load
* Gallery to load
* Logging API
* Cookie name

Each of these can be set in the URL via CGI parameters, like:

```
https://www.example.com/openstorytool?file=birds.csst
```

More details are given below in each subsection.

#### Project to load
To have the application render with a different project on page load, you can pass a `file` parameter, `file=birds.csst`.

For example, passing in the following:

```
https://www.example.com/openstorytool?file=birds.csst
```

Would show the page with the `birds` project already loaded, for students to work with.

#### Gallery to load
To have a non-default gallery load when the application is initially shown, pass a `gallery` parameter, `gallery=birds`.

For example, passing in the following:

```
https://www.example.com/openstorytool?gallery=birds
```

Would make the entire `birds` gallery available to students upon page load.

You can combine the above settings into a single URL, like the following:

```
https://www.example.com/openstorytool?project=birds.csst&gallery=birds
```

#### Logging API
To change where data is logged to, you can pass it an `api` parameter  
`api=/some/path/here`

For example, configuring the logging endpoint to `/foo` as below:

```
https://www.example.com/runkittyrun?api=/foo
```

Would attempt to send the application log data to:

```
https://www.example.com/foo
```

You will be expected to have some server-side API at `/foo` that handles data collection.

If no `api` parameter is included, the application will attempt to log to QBank's API located at `https://<current hostname>:8080/api/v1/logging/genericlog`. Details regarding what specific data is collected can be found in the OpenStoryTool [GitHub wiki](https://github.com/CLIxIndia-Dev/open-story-tool/wiki/OST-Logging-Information).

Data is sent as part of a payload with:

```
{
  data: {
    app_name: "OpenStory",
    session_id: "123",
    event_type: "slide_duped", // depends on the actual event
    params: { // see documentation for any included parameters }
  }
}
```

You can combine this configuration with the others through the URL:

```
https://www.example.com/openstorytool?api=/foo&project=birds.csst&gallery=birds
```

#### Cookie name
OpenStoryTool collects the current, logged-in user name or ID from a cookie in the client browser. You can configure the name of the cookie it looks for with the `cookieName` parameter.

```
https://www.example.com/openstorytool?cookieName=myUserIdCookie
```

The defaults that are searched for are `session_id`, `session_uuid`, and `user_id` (in that order). The first cookie found is used.

This user ID is included as the `session_id` parameter of the data payload sent in the logging messages, as well as in the `x-api-proxy` header.

Similarly, you can include this setting along with the others by combining them in the URL:

```
https://www.example.com/openstorytool?cookieName=myUserIdCookie&project=birds.csst&gallery=birds&api=/foo
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

```
<iframe src="/modules/OpenStoryTool/index.html" style="width:860px; height:600px" frameBorder="0"></iframe>
```

To specify a starting slideshow and/or a specific gallery, you need to provide the information to the Open Story tool’s code.

```
<iframe src="/modules/OpenStoryTool/index.html?gallery=birds&file=birds.csst" style="width:860px; height:600px" frameBorder="0"></iframe>
```

From this example, replace birds.csst with the name of the starting slideshow you want to use.
That starting file must be in the same folder as the index.html file. If you don’t include the file parameter, Open Story will start with a blank slideshow by default.

From this example, replace birds (the name of the gallery) with the name of the gallery you want to be available to the students. This must be a gallery that exists in the OpenStoryTool/images folder. If you don’t include the gallery parameter, Open Story will use the default gallery.

Please see the Open Story Tool GitHub wiki for more information.


# Third-party Licenses and Copyright
Please check `NOTICES.md` for more detailed information about third-party libraries and their licenses.

## Image Copyrights
All images located in the `/images` directory are in the public domain and sourced from https://www.publicdomainpictures.net.
