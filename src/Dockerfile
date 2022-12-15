#FROM docker.io/coriverse/shinyapps:amplify-frontend as previous
FROM docker.io/rocker/shiny-verse:latest as base

ARG gh_token
ENV GITHUB_TOKEN=$gh_token
ARG gh_token
ENV GITHUB_PAT=$gh_token

RUN apt update -y && \
    apt purge -y ca-certificates-java && apt install -y ca-certificates-java && \
    apt install -y ca-certificates libgdal-dev libharfbuzz-dev libfribidi-dev \
    libprotobuf-dev libv8-dev protobuf-compiler libudunits2-dev procps libsodium-dev && \
    update-ca-certificates -f -v

RUN Rscript -e 'local({ r <- getOption("repos"); r["CRAN"] <- "http://cran.r-project.org"; options(repos=r); }); install.packages(c("R6", "cli", "devtools", "future", "hrbrthemes", "httr", "httpuv", "leaflet", "packrat", "plumber", "remoter", "remotes", "renv", "sf", "shiny", "stringr", "tidyverse", "tools", "uuid", "websocket", "withr"));'

WORKDIR /srv/shiny-server

COPY .exec-shiny-app.R .exec-shiny-app.R

COPY renv.lock renv.lock

RUN Rscript -e '\
    version; \
    print(paste0("GITHUB_PAT: ", Sys.getenv("GITHUB_PAT")));  \
    renv::activate(); \
    renv::restore(clean = FALSE); \
'

RUN mkdir -p /srv/shiny-server/data
RUN chmod -R ga+rw /srv/shiny-server/*

FROM docker.io/rocker/shiny-verse:latest as app

ENV APP_NAME=frontend

RUN echo ${GITHUB_PAT}

WORKDIR /srv/shiny-server

COPY --from=base  /root/.cache/  /root/.cache/
COPY --from=base /srv/shiny-server /srv/shiny-server

RUN bash -c "if ! [[ -d $APP_NAME ]]; then mkdir $APP_NAME; fi"

## COPY app files from previous build to /srv/shiny-server/<app-name>
#COPY --from=previous  /root/.cache/  /root/.cache/
#COPY --from=previous /srv/shiny-server/$APP_NAME /srv/shiny-server/$APP_NAME
#COPY --from=previous /srv/shiny-server/$APP_NAME/app.R /srv/shiny-server/$APP_NAME/app.R
#COPY --from=previous /srv/shiny-server/$APP_NAME/modules /srv/shiny-server/$APP_NAME/modules/
#COPY --from=previous /srv/shiny-server/$APP_NAME/renv /srv/shiny-server/$APP_NAME/renv/
#COPY --from=previous /srv/shiny-server/$APP_NAME/templates /srv/shiny-server/$APP_NAME/templates/
#COPY --from=previous /srv/shiny-server/$APP_NAME/www /srv/shiny-server/$APP_NAME/www/

WORKDIR /srv/shiny-server/$APP_NAME

RUN echo $(ls -lA ./*)

COPY data ./data/

#COPY .Renviron .Renviron
COPY renv.lock renv.lock
COPY renv/activate.R renv/activate.R
COPY renv/settings.dcf renv/settings.dcf

COPY .exec-shiny-app.R .exec-shiny-app.R
COPY app.R app.R
COPY modules modules/
COPY templates templates/
COPY www www/
COPY README.md README.md

RUN chmod -R ga+rw /srv/shiny-server/$APP_NAME

#CMD /usr/bin/bash
#CMD /usr/bin/shiny-server
CMD .exec-shiny-app.R

ENTRYPOINT [ "Rscript", ".exec-shiny-app.R", "3000" ]

EXPOSE 3000
EXPOSE 3838
