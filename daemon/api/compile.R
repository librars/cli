# API for command \code{compile}

library(librarstemplates)

fetch_path_arg <- function(args) {
    # When Rscript is invoked with args on a script, the args to pass to
    # the script will appear after parameter `--args`
    index <- which(args %in% c("--args"))

    ret <- NULL
    if (is.numeric(index) && index > 0) {
        ret <- args[index + 1]
    }

    ret
}

# Getting the args passed to the script
# The first item is always the exec path
args <- commandArgs()
arg_path <- fetch_path_arg(args)

print(paste("Compiling", arg_path))

# Compile
librarstemplates::render(arg_path)

print("Compile terminated!")
