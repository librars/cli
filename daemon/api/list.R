# API for command \code{list}

library(librarstemplates)

print("Retrieving template list")

# Compile
res <- librarstemplates::get_template_list(as.json = TRUE)

print("Draft terminated!")

res
