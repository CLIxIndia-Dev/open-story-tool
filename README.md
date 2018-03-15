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

The default is QBank's API located at /api/v1/logging/genericlog and specifics regarding what specific data is collected can be found at:  
https://docs.google.com/spreadsheets/d/1okUrjl3S2qS6YD0w2ZZKrUydg6wkV7dJinkhXeTkx84/edit#gid=1611694291  
and more general data collection can be found at:  
https://docs.google.com/spreadsheets/d/1O6nZ_L8-I52smSw6fER8qIC6kqHZ0xwvRmeaTN8rhus/

### Embedding
Open Story can be embedded into an iframe, as outlined in the embedding document:  
https://docs.google.com/document/d/1R-tK3rZhi_YPH_x-R9C14jTzU_B0wmgmF4UTJL6PDRU/

# Third-party Licenses and Copyright
Please check `NOTICES.md` for more detailed information about third-party libraries and their licenses.

## Image Copyrights
All images located in the `/images` directory are in the public domain and sourced from https://www.publicdomainpictures.net.
