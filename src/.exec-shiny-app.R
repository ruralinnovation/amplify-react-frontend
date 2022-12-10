#!Rscript
# Title     : Execute Shiny App
# Objective : Initialize and run Shiny app as defined by local app.R or server.R/ui.R
# Created by: John Hall

if (as.numeric(version$major) == 3 && as.numeric(version$minor) >= 5) {
    options(repos = list(MRAN = "https://mran.microsoft.com/snapshot/2020-04-24", CRAN = "http://cran.rstudio.com/"))
    options(buildtools.check = list(function (action) { TRUE })[[1]])
}

args <- commandArgs(trailingOnly = TRUE)
appDir <- getwd()
#local_lib <- "lib"
local_lib <- .libPaths()[1]
local_port <- as.numeric("3000")
if (exists("args") && !is.null(args) && !is.na(args[1])) {
    if (!grepl("install", args[1])) {
        # Update path to app and lib
        if (!grepl("/", args[1])) {
            if (grepl("local", args[1])) {
                local_lib <- paste0(getwd(), "/lib")
                .libPaths(c(.libPaths(), local_lib))
            } else if (dir.exists(paste0(getwd(), "/", args[1]))) {
                appDir <- paste0(getwd(), "/", args[1])
            }
            # } else {
            #   appDir <- args[1]
            #   setwd(appDir)
        } else if (dir.exists(paste0(getwd(), "/", args[1]))) {
            appDir <- paste0(getwd(), "/", args[1])
        } else if (dir.exists(args[1])) {
            appDir <- args[1]
        } else {
            message(paste0("Cannot find app direcotry: ", args[1]))
            stop()
        }

    }

    if (!is.na(args[2]) && grepl("local", args[2])) {
        # Install packages to ./lib instead of user library
        local_lib <- paste0(getwd(), "/lib")
        .libPaths(c(.libPaths(), local_lib))

    } else if (!is.na(args[2]) && !grepl("install", args[2])) {
        # Change server port from 3000 to ...
        local_port <- switch(
          as.character(as.numeric(args[2])),
          "NA" = 3000,
          as.numeric(args[2])
        )
    }
}

if (!dir.exists(local_lib)) {
    dir.create(local_lib)
}

if (dir.exists("renv")) {
    local_lib <- paste0("renv/library/R-", version$major, ".", substr(version$minor,1,1), "/", version$platform)
    print(paste0("Use lib: ", local_lib))
    if (!require("renv")) {
        install.packages("renv")
    }
    renv::restore(library = local_lib, prompt = FALSE)

} else if (dir.exists("packrat")) tryCatch(
  withr::with_libpaths(local_lib, {
      if (!grepl("local", args[2])) try({
                                            print("Packrat config detected!")
                                            local_lib <- paste0("packrat/lib/", version$platform, "/", version$major, ".", version$minor)
                                            if (!file.exists(".Rprofile")) packrat::init()
                                            system(paste0("rm -rf ", local_lib, "/00LOCK-*"))
                                            packrat::restore(overwrite.dirty = TRUE)
                                        })
  }),
  error = function(e) {

      install.packages("withr")

      # DEBUG
      message(e)

      print("Packrat config detected!")
      local_lib <- paste0("packrat/lib/", version$platform, "/", version$major, ".", version$minor)
      if (!file.exists(".Rprofile") && dir.exists("packrat")) packrat::init()
      system(paste0("rm -rf ", local_lib, "/00LOCK-*"))
      packrat::restore(overwrite.dirty = TRUE)
  },
  finally = print(paste0("Use lib: ", local_lib))

)

install_package_deps <- function () {
    library(devtools)

    no_error <- FALSE

    if (any(nzchar(Sys.getenv("GITHUB_TOKEN")))) {
        auth_token <- Sys.getenv("GITHUB_TOKEN")
        if (!any(nzchar(Sys.getenv("GITHUB_PAT")))) {
            Sys.setenv(GITHUB_PAT = auth_token)
        }
    } else {
        auth_token <- Sys.getenv("GITHUB_PAT")
    }

    print(paste0("GITHUB_PAT: ", Sys.getenv("GITHUB_PAT")))

    if (file.exists(paste0(appDir, "/package.csv")) || file.exists(paste0(getwd(), "/package.csv"))) {

        if (!require("hrbrthemes")) {
            install.packages("hrbrthemes", lib = local_lib)
            hrbrthemes::import_roboto_condensed()
        }

        packages <- read.csv(
          switch(
            as.character(file.exists(paste0(appDir, "/package.csv"))),
            "TRUE" = paste0(appDir, "/package.csv"),
            "FALSE" = paste0(getwd(), "/package.csv")
          ),
          header = FALSE, sep = ",", as.is = TRUE, col.names = c("package", "path_version"))

        for (p in rownames(packages)) {
            package_idx <- as.numeric(p)
            package <- packages$package[package_idx]
            print(paste0(package, ": ", packages$path_version[package_idx]))

            try({
                    if (grepl("/", packages$path_version[package_idx])) {
                        github_path <- trimws(packages$path_version[package_idx])
                        if (!require(as.character(package[1]), character.only = TRUE)) {
                            message(sprintf(
                              'devtools::install_github("%s", lib = "%s", upgrade = "never", auth_token = "%s")',
                              github_path, local_lib, auth_token))
                            devtools::install_github(github_path, lib = local_lib, upgrade = "never", auth_token = auth_token)
                        }
                    } else {
                        version_string <- trimws(packages$path_version[package_idx])
                        if (!require(as.character(package[1]), character.only = TRUE) || version_string != as.character(packageVersion(package[1]))) {
                            message(sprintf(
                              'devtools::install_version("%s", lib = "%s", upgrade = "never", auth_token = "%s", version = "%s")',
                              package, local_lib, auth_token, version_string))
                            devtools::install_version(package, lib = local_lib, upgrade = "never", version = version_string)
                        }
                    }
                })

            if (!require(package[1], character.only = TRUE)) {
                if (dir.exists(paste0(local_lib, "/", package[1]))) {
                    devtools::install_deps(paste0(local_lib, "/", package[1]), lib = local_lib, upgrade = "never", dependencies = TRUE)
                }
                install.packages(package, lib = local_lib)
            }
        }

        no_error <- TRUE
    }

    no_error
}

no_error <- FALSE

while (!no_error) tryCatch(
  withr::with_libpaths(local_lib, {

      if (exists("args") && !is.null(args) && (grepl("install", args[1]) || grepl("install", args[2]))) {
          if (!require("devtools") || !require("stringi") || !require("stringr")) {
              install.packages(c("cli", "glue", "devtools", "stringr", "tidyverse", "usethis"), lib = local_lib)
          }

          no_error <- install_package_deps()

          if (dir.exists("packrat") && !grepl("local", args[2])) {
              if (!file.exists(".Rprofile")) packrat::init()
              print("Before taking a new packrat snapshot, try to remove LOCK dirs: ")
              system("mkdir -p del")
              print(paste0("mv ", local_lib, "/00LOCK-* del/"))
              system(paste0("mv ", local_lib, "/00LOCK-* del/"))
              system("ls -l del/*")
              print("rm -rf del")
              system("rm -rf del")
              packrat::snapshot(ignore.stale = TRUE)
              print("Snapshot saved.")
              print("Replace lib-R linked directory with actual libraries:")
              print('for f in $(find packrat/lib-R/x86_64-pc-linux-gnu/3.5.1/ -name "[A-Za-z]*"); do lib_path=$(ls -l $f | grep -oP "(\\/var\\/.+)"); if [ $lib_path ]; then rm $f && cp -ar $lib_path packrat/lib-R/x86_64-pc-linux-gnu/3.5.1/; fi; done;')
              system('for f in $(find packrat/lib-R/x86_64-pc-linux-gnu/3.5.1/ -name "[A-Za-z]*"); do lib_path=$(ls -l $f | grep -oP "(\\/var\\/.+)"); if [ $lib_path ]; then rm $f && cp -ar $lib_path packrat/lib-R/x86_64-pc-linux-gnu/3.5.1/; fi; done;')
              print("Attempting bundle...")
              packrat::bundle(file = "packrat.tar.gz")
              if (file.exists("packrat.tar.gz")) {
                  print("Bundle saved.")
              }
          }

          print("Installation finished.")

      } else {

          library(shiny)

          options(shiny.host = "0.0.0.0") # listen on all available network interfaces
          options(shiny.port = local_port)
          #options(shiny.launch.browser = .rs.invokeShinyWindowExternal)

          print(paste0("Run Shiny app: ", appDir))
          print(paste0("Use local dir: ", getwd()))
          print(list.files(appDir))
          print(paste0("Use local lib: ", local_lib))
          print(.libPaths())

          if (grepl("/", appDir)) {
              if (file.exists(paste0(appDir, "/server.R"))) {
                  print(paste0("With ", appDir, "/server.R: ", file.exists(paste0(appDir, "/server.R"))))
              } else if (file.exists(paste0(appDir, "/app.R"))) {
                  print(paste0("With ", appDir, "/app.R: ", file.exists(paste0(appDir, "/app.R"))))
              }
              setwd(appDir)
              shiny::runApp(appDir, launch.browser = FALSE)

          } else {
              if (file.exists("server.R")) {
                  print(paste0("With server.R: ", file.exists("server.R")))
              } else if (file.exists("app.R")) {
                  print(paste0("With app.R: ", file.exists("app.R")))
              }
              shiny::runApp(launch.browser = FALSE)
          }
      }

      no_error <- TRUE

  }),
  error = function(e) {

      # DEBUG
      message(e)

      #if (!no_error) {
      if (!is.null(e) && !is.na(e$message) && grepl("package", e$message))
        withr::with_libpaths(local_lib, {

            print(sprintf("ERROR: %s", e$message))

            str_pattern <- paste0("(?:package\\scalled|namespace) ['|‘]([\\w]+)")
            package_match <- stringr::str_match(e$message, str_pattern)[,2]
            print(paste0("Missing package match: ", package_match))

            if (!is.null(package_match) && !is.na(package_match) && !require(package_match[1], character.only = TRUE)) {
                if (dir.exists(paste0(local_lib, "/", package_match))) {
                    if (!require("devtools") || !require("stringi") || !require("stringr")) {
                        install.packages(c("cli", "glue", "devtools", "stringr", "tidyverse", "usethis"))
                    }
                    devtools::install_deps(paste0(local_lib, "/", package_match), lib = local_lib, upgrade = "never", dependencies = TRUE)
                }
                install.packages(package_match, lib = local_lib)
            }

            install_package_deps()

        })
      else quit(save = "no", status = 1, runLast = FALSE)

  },
  finally = "Shiny app terminated."
)
