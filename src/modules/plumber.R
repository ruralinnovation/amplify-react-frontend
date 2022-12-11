# plumber.R
#*@apiTitle Example Plumber API

#* Get Histogram raw data
#* @get /hist-raw
function(bins) {
   x <- faithful$waiting
   bins <- as.numeric(bins)
   breaks <- seq(min(x), max(x), length.out = bins + 1)
   hist_out <- hist(x, breaks = breaks, main = "Raw Histogram")
   message(hist_out[2:6])
   as.data.frame(hist_out[2:6])
}
