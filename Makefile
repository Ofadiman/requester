# Script used to run the application locally in development mode.
local:
	rm -rf .webpack && \
	export NODE_ENV=development && \
	export LOG_LEVEL=debug && \
	yarn electron-forge start

package:
	yarn electron-forge package

make:
	yarn electron-forge make

publish:
	yarn electron-forge publish
