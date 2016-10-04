# barlights

This is a project that runs on a Raspberry Pi and uses a Hall effect sensor to turn my friend's dark liquor cabinet into a beautifully lit LED extravaganza, just by opening the cupboard door.

===

Readme files are usually for other people.

Until this project is in a working state that I'm happy with, this readme file is for me.

===

Well, it's working in its Dockerized form, but there's still considerable confusion around why the filesystem in the generated app image isn't the same as the one I'm trying to copy in from this repository...  I must have some misunderstanding about how COPY works, or maybe there's a typo that my hunger-addled brain isn't catching.

Maybe it has to do with the current working directory of each Dockerfile?  Revisit the assumptions you have about this.
