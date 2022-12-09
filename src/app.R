library(cori.apps)

options(`show.error.messages` = TRUE)
options(`usethis.protocol` = "ssh")

## include()... an easy, RStudio re-loadable, way to dynamically
## load Shiny modules (unlike R.utils::sourceDirectory())
include("modules/library.R")
include("modules/global.R")

# Create Shiny app ----
shinyApp(

    # Define function that *calls* ui ----
    ui = function () {
        include("modules/ui.R")
        ui()
    },

    # Define function that *calls* server logic function ----
    server = function (input, output, session) {

        # R.utils::sourceDirectory("modules", local = TRUE)
        ## Instead of ^ R.utils::sourceDirectory(), we use include()...
        ## If called within server/ui function, path to module file
        ## must be relative to dir in which app.R is executing ...

        include("modules/server.R")
        server(input, output, session)
    }
)
