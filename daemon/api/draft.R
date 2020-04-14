# API for command \code{draft}

library(librarstemplates)

fetch_arg <- function(args, pos) {
    # When Rscript is invoked with args on a script, the args to pass to
    # the script will appear after parameter `--args`
    index <- which(args %in% c("--args"))

    ret <- NULL
    if (is.numeric(index) && index > 0) {
        ret <- args[index + pos]
    }

    ret
}

fetch_templatename_arg <- function(args) {
    fetch_arg(args, 1)
}

fetch_path_arg <- function(args) {
    fetch_arg(args, 2)
}

# Getting the args passed to the script
# The first item is always the exec path
args <- commandArgs()
arg_templatename <- fetch_templatename_arg(args)
arg_path <- fetch_path_arg(args)

print(paste("Retrieving draft artifacts for template", arg_templatename, "and saving into", arg_path))

# Compile
librarstemplates::draft(arg_templatename, dir = arg_path)

print("Draft terminated!")
