# Docker Build Process

We will build a public docker image with small pre-loaded sets to something like docker hub.

We can then download the image from dockerhub and connect to it specifically with pgadmin.  Making it much easier to learn.

## High level:

postgres_docker_build is the build directory.  We use build.sh command to build the container.  We can run it with bin/start.sh.  The docker build process creates an image off of postgres 17.7, then it runs the database_setup init files in ascending order.  That should create a database car_factory with a user called student and pre-populated tables.

I created a tests directory that should be used for running tests against the docker image.  Once it passes tests, we can then have a script that just pushes it to the public docker location.  TBD on the location.